import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import App from './App';

vi.mock('./hooks/useSubscribe', () => ({
	default: vi.fn(),
}));

test('renders the dashboard shell labels', () => {
	render(<App />);

	expect(
		screen.getByRole('heading', { name: 'Outdoor climate' }),
	).toBeInTheDocument();
	expect(
		screen.getByRole('heading', { name: 'Indoor climate' }),
	).toBeInTheDocument();
	expect(screen.getByRole('heading', { name: 'Wind' })).toBeInTheDocument();
	expect(screen.getByText('MPH')).toBeInTheDocument();
});
