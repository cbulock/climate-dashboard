import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Dashboard from '../Dashboard';
import renderWithEntities from '../test/renderWithEntities';

vi.mock('../hooks/useSubscribe', () => ({
	default: vi.fn(),
}));

const entities = {
	'sensor.outdoor_temp': { state: '58' },
	'sensor.indoor_temp': { state: '71' },
	'sensor.outdoor_humidity': { state: '45' },
	'sensor.indoor_humidity': { state: '38' },
	'sensor.pool_temp': { state: '82' },
	'switch.pool_pump': { state: 'on' },
	'sensor.hot_tub_temp': { state: '101' },
	'sensor.upstairs_temp': { state: '72' },
	'sensor.upstairs_humidity': { state: '36' },
	'sensor.main_floor_temp': { state: '70' },
	'sensor.main_floor_humidity': { state: '40' },
	'sensor.basement_temp': { state: '67' },
	'sensor.basement_humidity': { state: '50' },
	'sensor.wind_avg': { state: '12' },
	'sensor.wind_direction': { state: '180' },
};

describe('Dashboard', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('renders the current climate readings during pool season', () => {
		vi.setSystemTime(new Date('2026-06-20T12:00:00Z'));

		renderWithEntities(<Dashboard />, { entities });

		expect(screen.getByText('Outdoors')).toBeInTheDocument();
		expect(screen.getByText('Indoors')).toBeInTheDocument();
		expect(screen.getByText(/58/)).toBeInTheDocument();
		expect(screen.getByText(/71/)).toBeInTheDocument();
		expect(screen.getByText(/82/)).toBeInTheDocument();
		expect(screen.getByText(/101/)).toBeInTheDocument();
		expect(screen.getByText('MPH')).toBeInTheDocument();
	});

	it('hides the pool panel outside pool season', () => {
		vi.setSystemTime(new Date('2026-01-20T12:00:00Z'));

		renderWithEntities(<Dashboard />, { entities });

		expect(
			screen.queryByText((_, element) => element?.textContent === '82°'),
		).not.toBeInTheDocument();
		expect(screen.getByText(/101/)).toBeInTheDocument();
	});
});
