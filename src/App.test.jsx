import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import App from './App';

vi.mock('./hooks/useSubscribe', () => ({
	default: vi.fn(),
}));

test('renders the dashboard shell labels', () => {
	render(<App />);

	expect(screen.getByText('Outdoors')).toBeInTheDocument();
	expect(screen.getByText('Indoors')).toBeInTheDocument();
	expect(screen.getByText('MPH')).toBeInTheDocument();
});
