import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Toasts from './Toasts';
import renderWithEntities from '../test/renderWithEntities';

describe('Toasts', () => {
	it('renders alert descriptions from Home Assistant alert data', () => {
		renderWithEntities(<Toasts />, {
			entities: {
				'switch.alerts': {
					attributes: {
						data: [
							{
								name: 'freeze-warning',
								description: 'Freeze warning',
								rgb_color: [255, 170, 0],
							},
							{
								name: 'wind-alert',
								description: 'High wind alert',
								rgb_color: [255, 0, 0],
							},
						],
					},
				},
			},
		});

		expect(screen.getByText('Freeze warning')).toBeInTheDocument();
		expect(screen.getByText('High wind alert')).toBeInTheDocument();
	});
});
