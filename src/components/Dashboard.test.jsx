import { screen, within } from '@testing-library/react';
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
	'sensor.pond_temp': { state: '64' },
	'sensor.uv_index': { state: '8' },
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

		expect(
			screen.getByRole('heading', { name: 'Outdoor Climate' }),
		).toBeInTheDocument();
		expect(
			screen.getByRole('region', { name: 'Outdoor Climate' }),
		).toBeInTheDocument();
		expect(
			screen.getByRole('heading', { name: 'Main Floor Climate' }),
		).toBeInTheDocument();
		expect(screen.getByText(/58/)).toBeInTheDocument();
		expect(
			within(
				screen.getByRole('region', { name: 'Main Floor Climate' }),
			).getByText(/70/),
		).toBeInTheDocument();
		expect(screen.queryByText(/71/)).not.toBeInTheDocument();
		expect(screen.queryByText(/101/)).not.toBeInTheDocument();
		expect(
			screen.getByRole('heading', { name: 'Home levels' }),
		).toBeInTheDocument();
		expect(
			within(screen.getByRole('region', { name: 'Home levels' }))
				.getAllByText(/^(2|1|B)$/)
				.map(({ textContent }) => textContent),
		).toEqual(['2', '1', 'B']);
		expect(screen.getByRole('heading', { name: 'Wind' })).toBeInTheDocument();
		expect(screen.getByText('MPH')).toBeInTheDocument();
		expect(
			screen.getByRole('region', { name: 'Pond and UV' }),
		).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Pond' })).toBeInTheDocument();
		expect(
			screen.getByRole('heading', { name: 'UV index' }),
		).toBeInTheDocument();
		expect(screen.getByText(/64/)).toBeInTheDocument();
		expect(screen.getByText('8')).toBeInTheDocument();
		expect(screen.getByText('Very high UV')).toBeInTheDocument();
		const uvCard = screen.getByText('Very high UV').closest('[data-uv-risk]');

		expect(uvCard).toHaveAttribute('data-uv-risk', 'very-high');
	});

	it('shows the hot tub panel when the feature flag is enabled', () => {
		import.meta.env.VITE_ENABLE_HOT_TUB = 'true';

		renderWithEntities(<Dashboard />, { entities });

		expect(screen.getByText(/101/)).toBeInTheDocument();
	});

	it('marks temperature panels when raw values exceed heat thresholds', () => {
		renderWithEntities(<Dashboard />, {
			entities: {
				...entities,
				'sensor.outdoor_temp': { state: '100.1' },
				'sensor.main_floor_temp': { state: '80.1' },
				'sensor.pond_temp': { state: '90.1' },
			},
		});

		expect(
			screen.getByRole('region', { name: 'Outdoor Climate' }),
		).toHaveAttribute('data-heat-warning', 'true');
		expect(
			screen.getByRole('region', { name: 'Main Floor Climate' }),
		).toHaveAttribute('data-heat-warning', 'true');
		expect(
			screen
				.getByRole('heading', { name: 'Pond' })
				.closest('[data-heat-warning]'),
		).toHaveAttribute('data-heat-warning', 'true');
	});
});
