import { useContext, useEffect, useRef, useState } from 'react';

import { EntitiesContext } from '../context/Entities';

const HOUR_IN_MS = 60 * 60 * 1000;
const PRUNE_INTERVAL_MS = 5 * 60 * 1000;

const normalizeHistory = (history, entityIds, cutoff) =>
	Object.fromEntries(
		entityIds
			.map((entityId) => {
				const uniquePoints = new Map();
				let startValue;
				let startValueTimestamp = Number.NEGATIVE_INFINITY;

				(history?.[entityId] || []).forEach((state) => {
					const timestamp = Number(state.lu ?? state.lc) * 1000;
					const value = Number(state.s);

					if (!Number.isFinite(timestamp) || !Number.isFinite(value)) {
						return;
					}

					if (timestamp < cutoff && timestamp > startValueTimestamp) {
						startValue = value;
						startValueTimestamp = timestamp;
					} else if (timestamp >= cutoff) {
						uniquePoints.set(timestamp, { timestamp, value });
					}
				});

				if (startValue !== undefined && !uniquePoints.has(cutoff)) {
					uniquePoints.set(cutoff, {
						timestamp: cutoff,
						value: startValue,
					});
				}

				const points = Array.from(uniquePoints.values()).sort(
					(left, right) => left.timestamp - right.timestamp,
				);

				return [entityId, points];
			})
			.filter(([, points]) => points.length > 0),
	);

const mergeHistoryResponse = (
	normalizedHistory,
	currentHistory,
	entities,
	entityIds,
	requestEnd,
) =>
	Object.fromEntries(
		entityIds
			.map((entityId) => {
				const uniquePoints = new Map(
					(normalizedHistory[entityId] || []).map((point) => [
						point.timestamp,
						point,
					]),
				);

				(currentHistory[entityId] || [])
					.filter((point) => point.timestamp > requestEnd)
					.forEach((point) => uniquePoints.set(point.timestamp, point));

				const entity = entities[entityId];
				const currentValue = Number(entity?.state);
				const currentTimestamp = Date.parse(
					entity?.last_updated || entity?.last_changed,
				);

				if (
					Number.isFinite(currentValue) &&
					(!Number.isFinite(currentTimestamp) || currentTimestamp <= requestEnd)
				) {
					uniquePoints.set(requestEnd, {
						timestamp: requestEnd,
						value: currentValue,
					});
				}

				const points = Array.from(uniquePoints.values()).sort(
					(left, right) => left.timestamp - right.timestamp,
				);

				return [entityId, points];
			})
			.filter(([, points]) => points.length > 0),
	);

const appendLiveStates = (history, entities, entityIds, cutoff) => {
	let changed = false;
	const nextHistory = { ...history };

	entityIds.forEach((entityId) => {
		const entity = entities[entityId];
		const timestamp = Date.parse(entity?.last_updated || entity?.last_changed);
		const value = Number(entity?.state);

		if (!Number.isFinite(timestamp) || !Number.isFinite(value)) return;
		if (timestamp < cutoff) return;

		const currentPoints = history[entityId] || [];
		const retainedPoints = currentPoints.filter(
			(point) => point.timestamp >= cutoff && point.timestamp !== timestamp,
		);
		const lastPoint = currentPoints[currentPoints.length - 1];

		if (
			lastPoint?.timestamp === timestamp &&
			lastPoint?.value === value &&
			retainedPoints.length === currentPoints.length - 1
		) {
			return;
		}

		nextHistory[entityId] = [...retainedPoints, { timestamp, value }].sort(
			(left, right) => left.timestamp - right.timestamp,
		);
		changed = true;
	});

	return changed ? nextHistory : history;
};

const pruneHistory = (history, entities, entityIds, cutoff, now) => {
	let changed = false;
	const nextHistory = {};

	entityIds.forEach((entityId) => {
		const points = history[entityId] || [];
		const retainedPoints = points.filter((point) => point.timestamp >= cutoff);
		const boundaryPoints = points.filter((point) => point.timestamp < cutoff);
		const boundaryPoint = boundaryPoints[boundaryPoints.length - 1];
		const uniquePoints = new Map(
			retainedPoints.map((point) => [point.timestamp, point]),
		);

		if (boundaryPoint && !uniquePoints.has(cutoff)) {
			uniquePoints.set(cutoff, {
				timestamp: cutoff,
				value: boundaryPoint.value,
			});
		}

		const currentValue = Number(entities[entityId]?.state);

		if (Number.isFinite(currentValue) && uniquePoints.size > 0) {
			uniquePoints.set(now, { timestamp: now, value: currentValue });
		}

		const nextPoints = Array.from(uniquePoints.values()).sort(
			(left, right) => left.timestamp - right.timestamp,
		);

		if (
			nextPoints.length !== points.length ||
			nextPoints.some(
				(point, index) =>
					point.timestamp !== points[index]?.timestamp ||
					point.value !== points[index]?.value,
			)
		) {
			changed = true;
		}

		if (nextPoints.length > 0) nextHistory[entityId] = nextPoints;
	});

	return changed ? nextHistory : history;
};

const useHassHistory = (entityIds, hours = 24) => {
	const { connection, entities } = useContext(EntitiesContext);
	const [history, setHistory] = useState({});
	const entitiesRef = useRef(entities);
	const windowLength = hours * HOUR_IN_MS;

	entitiesRef.current = entities;

	useEffect(() => {
		if (!connection) {
			setHistory({});
			return undefined;
		}

		let isActive = true;
		let requestId = 0;

		const loadHistory = async () => {
			const currentRequestId = requestId + 1;
			requestId = currentRequestId;
			const endTime = new Date();
			const startTime = new Date(endTime.getTime() - windowLength);

			try {
				const response = await connection.sendMessagePromise({
					type: 'history/history_during_period',
					start_time: startTime.toISOString(),
					end_time: endTime.toISOString(),
					entity_ids: entityIds,
					minimal_response: true,
					no_attributes: true,
					significant_changes_only: true,
				});

				if (isActive && currentRequestId === requestId) {
					const normalizedHistory = normalizeHistory(
						response,
						entityIds,
						startTime.getTime(),
					);

					setHistory((current) =>
						mergeHistoryResponse(
							normalizedHistory,
							current,
							entitiesRef.current,
							entityIds,
							endTime.getTime(),
						),
					);
				}
			} catch {
				// Live values and previously loaded history remain usable.
			}
		};

		loadHistory();
		connection.addEventListener('ready', loadHistory);

		return () => {
			isActive = false;
			connection.removeEventListener('ready', loadHistory);
		};
	}, [connection, entityIds, windowLength]);

	useEffect(() => {
		const cutoff = Date.now() - windowLength;

		setHistory((current) =>
			appendLiveStates(current, entities, entityIds, cutoff),
		);
	}, [entities, entityIds, windowLength]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const now = Date.now();
			const cutoff = now - windowLength;
			setHistory((current) =>
				pruneHistory(current, entitiesRef.current, entityIds, cutoff, now),
			);
		}, PRUNE_INTERVAL_MS);

		return () => clearInterval(intervalId);
	}, [entityIds, windowLength]);

	return history;
};

export default useHassHistory;
