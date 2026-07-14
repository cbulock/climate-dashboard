import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EntitiesContext } from '../context/Entities';
import useHassHistory from './useHassHistory';

const ENTITY_IDS = ['sensor.outdoor_temp', 'sensor.uv_index'];

const HookProbe = () => {
	const history = useHassHistory(ENTITY_IDS);

	return <pre data-testid="history">{JSON.stringify(history)}</pre>;
};

const renderProbe = ({ connection, entities = {} }) =>
	render(
		<EntitiesContext.Provider
			value={{
				connection,
				entities,
				setConnection: vi.fn(),
				setEntities: vi.fn(),
			}}
		>
			<HookProbe />
		</EntitiesContext.Provider>,
	);

const createConnection = (response) => {
	const listeners = new Map();
	const connection = {
		addEventListener: vi.fn((event, callback) =>
			listeners.set(event, callback),
		),
		removeEventListener: vi.fn((event) => listeners.delete(event)),
		sendMessagePromise: vi.fn().mockResolvedValue(response),
	};

	return { connection, listeners };
};

describe('useHassHistory', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it('loads all entities in one request and normalizes numeric history', async () => {
		const recentTimestamp = Date.now() / 1000 - 60;
		const oldTimestamp = Date.now() / 1000 - 25 * 60 * 60;
		const { connection } = createConnection({
			'sensor.outdoor_temp': [
				{ s: '71', lu: oldTimestamp },
				{ s: '72.5', lu: recentTimestamp },
				{ s: 'unknown', lu: recentTimestamp + 30 },
			],
			'sensor.uv_index': [{ s: '4', lu: recentTimestamp }],
		});

		renderProbe({ connection });

		await waitFor(() => {
			expect(connection.sendMessagePromise).toHaveBeenCalledTimes(1);
		});

		expect(connection.sendMessagePromise).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'history/history_during_period',
				entity_ids: ENTITY_IDS,
				minimal_response: true,
				no_attributes: true,
			}),
		);
		const history = JSON.parse(screen.getByTestId('history').textContent);

		expect(history).toEqual({
			'sensor.outdoor_temp': [
				{ timestamp: expect.any(Number), value: 71 },
				{ timestamp: recentTimestamp * 1000, value: 72.5 },
			],
			'sensor.uv_index': [{ timestamp: recentTimestamp * 1000, value: 4 }],
		});
		expect(history['sensor.outdoor_temp'][0].timestamp).toBeCloseTo(
			Date.now() - 24 * 60 * 60 * 1000,
			-2,
		);
	});

	it('adds live points and refreshes history when the connection is ready again', async () => {
		const initialTimestamp = Date.now() / 1000 - 120;
		const liveTimestamp = new Date(Date.now() - 30 * 1000).toISOString();
		const { connection, listeners } = createConnection({
			'sensor.outdoor_temp': [{ s: '70', lu: initialTimestamp }],
		});
		const { rerender } = renderProbe({ connection });

		await waitFor(() => {
			expect(connection.sendMessagePromise).toHaveBeenCalledTimes(1);
		});

		rerender(
			<EntitiesContext.Provider
				value={{
					connection,
					entities: {
						'sensor.outdoor_temp': {
							state: '71',
							last_updated: liveTimestamp,
						},
					},
					setConnection: vi.fn(),
					setEntities: vi.fn(),
				}}
			>
				<HookProbe />
			</EntitiesContext.Provider>,
		);

		await waitFor(() => {
			const history = JSON.parse(screen.getByTestId('history').textContent);
			expect(history['sensor.outdoor_temp']).toHaveLength(2);
		});

		connection.sendMessagePromise.mockResolvedValue({
			'sensor.outdoor_temp': [{ s: '71', lu: Date.now() / 1000 }],
		});
		listeners.get('ready')();

		await waitFor(() => {
			expect(connection.sendMessagePromise).toHaveBeenCalledTimes(2);
		});
	});

	it('keeps history failures from affecting current-value rendering', async () => {
		const { connection } = createConnection({});
		connection.sendMessagePromise.mockRejectedValue(
			new Error('Recorder unavailable'),
		);

		renderProbe({ connection });

		await waitFor(() => {
			expect(connection.sendMessagePromise).toHaveBeenCalled();
		});

		expect(screen.getByTestId('history')).toHaveTextContent('{}');
	});

	it('preserves existing history when a reconnect refresh fails', async () => {
		const timestamp = Date.now() / 1000 - 60;
		const { connection, listeners } = createConnection({
			'sensor.outdoor_temp': [{ s: '72', lu: timestamp }],
		});

		renderProbe({ connection });

		await waitFor(() => {
			expect(screen.getByTestId('history')).toHaveTextContent('"value":72');
		});

		connection.sendMessagePromise.mockRejectedValue(
			new Error('Recorder unavailable'),
		);
		listeners.get('ready')();

		await waitFor(() => {
			expect(connection.sendMessagePromise).toHaveBeenCalledTimes(2);
		});

		expect(screen.getByTestId('history')).toHaveTextContent('"value":72');
	});

	it('preserves live points that arrive while history is loading', async () => {
		let resolveHistory;
		const connection = {
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			sendMessagePromise: vi.fn(
				() =>
					new Promise((resolve) => {
						resolveHistory = resolve;
					}),
			),
		};
		const liveTimestamp = new Date(Date.now() + 1000).toISOString();
		const { rerender } = renderProbe({ connection });

		rerender(
			<EntitiesContext.Provider
				value={{
					connection,
					entities: {
						'sensor.outdoor_temp': {
							state: '73',
							last_updated: liveTimestamp,
						},
					},
					setConnection: vi.fn(),
					setEntities: vi.fn(),
				}}
			>
				<HookProbe />
			</EntitiesContext.Provider>,
		);

		resolveHistory({
			'sensor.outdoor_temp': [{ s: '72', lu: Date.now() / 1000 - 60 }],
		});

		await waitFor(() => {
			const history = JSON.parse(screen.getByTestId('history').textContent);

			expect(history['sensor.outdoor_temp']).toEqual(
				expect.arrayContaining([
					{
						timestamp: Date.parse(liveTimestamp),
						value: 73,
					},
				]),
			);
			expect(
				history['sensor.outdoor_temp'].filter((point) => point.value === 73),
			).toHaveLength(1);
		});
	});

	it('carries a stable value across the rolling 24-hour boundary', async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-07-14T16:00:00.000Z'));

		const oldTimestamp = Date.now() / 1000 - 25 * 60 * 60;
		const { connection } = createConnection({
			'sensor.outdoor_temp': [{ s: '70', lu: oldTimestamp }],
		});
		const { unmount } = renderProbe({
			connection,
			entities: {
				'sensor.outdoor_temp': { state: '70' },
			},
		});

		await act(async () => {
			await Promise.resolve();
		});

		act(() => {
			vi.advanceTimersByTime(5 * 60 * 1000);
		});

		const history = JSON.parse(screen.getByTestId('history').textContent);
		const points = history['sensor.outdoor_temp'];

		expect(points[0]).toEqual({
			timestamp: Date.now() - 24 * 60 * 60 * 1000,
			value: 70,
		});
		expect(points[points.length - 1]).toEqual({
			timestamp: Date.now(),
			value: 70,
		});
		unmount();
		unmount();
	});
});
