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
		import.meta.env.VITE_ENABLE_HOT_TUB = undefined;
	});

	afterEach(() => {
		delete import.meta.env.VITE_ENABLE_HOT_TUB;
	});

	it('renders the core climate dashboard without pool or hot tub panels by default', () => {
		renderWithEntities(<Dashboard />, { entities });

		expect(screen.getByText('Outdoors')).toBeInTheDocument();
		expect(screen.getByText('Indoors')).toBeInTheDocument();
		expect(screen.getByText(/58/)).toBeInTheDocument();
		expect(screen.getByText(/71/)).toBeInTheDocument();
		expect(screen.queryByText(/101/)).not.toBeInTheDocument();
		expect(screen.getByText('MPH')).toBeInTheDocument();
	});

	it('shows the hot tub panel when the feature flag is enabled', () => {
		import.meta.env.VITE_ENABLE_HOT_TUB = 'true';

		renderWithEntities(<Dashboard />, { entities });

		expect(screen.getByText(/101/)).toBeInTheDocument();
	});
});
