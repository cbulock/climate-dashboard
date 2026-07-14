import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import App from './App';

vi.mock('./hooks/useSubscribe', () => ({
	default: vi.fn(),
}));

vi.mock('./hooks/useToasts', () => ({
	default: () => [
		{
			name: 'hidden-alert',
			description: 'Temporarily hidden alert',
		},
	],
}));

test('renders the dashboard shell labels', () => {
	render(<App />);

	expect(
		screen.getByRole('heading', { name: 'Outdoor Climate' }),
	).toBeInTheDocument();
	expect(
		screen.getByRole('heading', { name: 'Main Floor Climate' }),
	).toBeInTheDocument();
	expect(screen.getByRole('heading', { name: 'Wind' })).toBeInTheDocument();
	expect(screen.getByText('MPH')).toBeInTheDocument();
	expect(
		screen.queryByText('Temporarily hidden alert'),
	).not.toBeInTheDocument();
});
