const MINUTE_IN_MS = 60 * 1000;

const averageHistoryPoints = (points = [], bucketMinutes = 15) => {
	const bucketSize = bucketMinutes * MINUTE_IN_MS;
	const buckets = new Map();

	points.forEach(({ timestamp, value }) => {
		const numericTimestamp = Number(timestamp);
		const numericValue = Number(value);

		if (!Number.isFinite(numericTimestamp) || !Number.isFinite(numericValue)) {
			return;
		}

		const bucketStart = Math.floor(numericTimestamp / bucketSize) * bucketSize;
		const bucket = buckets.get(bucketStart) || {
			timestampTotal: 0,
			valueTotal: 0,
			count: 0,
		};

		bucket.timestampTotal += numericTimestamp;
		bucket.valueTotal += numericValue;
		bucket.count += 1;
		buckets.set(bucketStart, bucket);
	});

	return Array.from(buckets.values())
		.map(({ timestampTotal, valueTotal, count }) => ({
			timestamp: timestampTotal / count,
			value: valueTotal / count,
		}))
		.sort((left, right) => left.timestamp - right.timestamp);
};

export const smoothHistoryPoints = (points = [], windowSize = 7) => {
	const validPoints = points
		.map(({ timestamp, value }) => ({
			timestamp: Number(timestamp),
			value: Number(value),
		}))
		.filter(
			({ timestamp, value }) =>
				Number.isFinite(timestamp) && Number.isFinite(value),
		)
		.sort((left, right) => left.timestamp - right.timestamp);
	const radius = Math.max(1, Math.floor(windowSize / 2));

	return validPoints.map((point, index) => {
		const windowStart = Math.max(0, index - radius);
		const windowEnd = Math.min(validPoints.length, index + radius + 1);
		const window = validPoints.slice(windowStart, windowEnd);
		const value =
			window.reduce((total, sample) => total + sample.value, 0) / window.length;

		return { timestamp: point.timestamp, value };
	});
};

export default averageHistoryPoints;
