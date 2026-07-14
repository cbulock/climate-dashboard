import { describe, expect, it } from 'vitest';

import getUvRisk from './uv';

describe('getUvRisk', () => {
	it.each([
		[0, null],
		[5, null],
		[6, { label: 'High UV', level: 'high' }],
		[8, { label: 'Very high UV', level: 'very-high' }],
		[11, { label: 'Extreme UV', level: 'extreme' }],
	])('classifies UV index %s', (value, expected) => {
		expect(getUvRisk(value)).toEqual(expected);
	});
});
