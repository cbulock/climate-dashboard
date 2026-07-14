import { describe, expect, it } from 'vitest';

import averageHistoryPoints, { smoothHistoryPoints } from './history';

describe('averageHistoryPoints', () => {
	it('averages values and timestamps within 15-minute buckets', () => {
		const minute = 60 * 1000;

		expect(
			averageHistoryPoints([
				{ timestamp: 0, value: 10 },
				{ timestamp: 5 * minute, value: 20 },
				{ timestamp: 14 * minute, value: 30 },
				{ timestamp: 15 * minute, value: 40 },
			]),
		).toEqual([
			{ timestamp: (19 / 3) * minute, value: 20 },
			{ timestamp: 15 * minute, value: 40 },
		]);
	});

	it('ignores invalid samples', () => {
		expect(
			averageHistoryPoints([
				{ timestamp: 0, value: 12 },
				{ timestamp: Number.NaN, value: 30 },
				{ timestamp: 1000, value: Number.NaN },
			]),
		).toEqual([{ timestamp: 0, value: 12 }]);
	});

	it('supports wider buckets for slowly changing temperatures', () => {
		const minute = 60 * 1000;

		expect(
			averageHistoryPoints(
				[
					{ timestamp: 0, value: 70 },
					{ timestamp: 20 * minute, value: 72 },
					{ timestamp: 30 * minute, value: 74 },
				],
				30,
			),
		).toEqual([
			{ timestamp: 10 * minute, value: 71 },
			{ timestamp: 30 * minute, value: 74 },
		]);
	});

	it('smooths values without dropping their timestamps', () => {
		expect(
			smoothHistoryPoints(
				[
					{ timestamp: 1, value: 10 },
					{ timestamp: 2, value: 20 },
					{ timestamp: 3, value: 30 },
					{ timestamp: 4, value: 40 },
					{ timestamp: 5, value: 50 },
				],
				3,
			),
		).toEqual([
			{ timestamp: 1, value: 15 },
			{ timestamp: 2, value: 20 },
			{ timestamp: 3, value: 30 },
			{ timestamp: 4, value: 40 },
			{ timestamp: 5, value: 45 },
		]);
	});
});
