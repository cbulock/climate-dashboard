import { render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	createConnection,
	createLongLivedTokenAuth,
	subscribeEntities,
} from 'home-assistant-js-websocket';

import { EntitiesContext } from '../context/Entities';
import useSubscribe from './useSubscribe';

vi.mock('home-assistant-js-websocket', () => ({
	createConnection: vi.fn(),
	createLongLivedTokenAuth: vi.fn(),
	subscribeEntities: vi.fn(),
}));

const HookProbe = () => {
	useSubscribe();

	return null;
};

const originalEnv = {
	VITE_HASS_URL: import.meta.env.VITE_HASS_URL,
	VITE_HASS_TOKEN: import.meta.env.VITE_HASS_TOKEN,
};

describe('useSubscribe', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		import.meta.env.VITE_HASS_URL = 'https://example.home-assistant.local';
		import.meta.env.VITE_HASS_TOKEN = 'test-token';
	});

	afterEach(() => {
		import.meta.env.VITE_HASS_URL = originalEnv.VITE_HASS_URL;
		import.meta.env.VITE_HASS_TOKEN = originalEnv.VITE_HASS_TOKEN;
	});

	it('throws at render time when Home Assistant config is missing', () => {
		delete import.meta.env.VITE_HASS_URL;
		delete import.meta.env.VITE_HASS_TOKEN;

		const setEntities = vi.fn();

		expect(() =>
			render(
				<EntitiesContext.Provider value={{ entities: {}, setEntities }}>
					<HookProbe />
				</EntitiesContext.Provider>,
			),
		).toThrow('Missing Home Assistant configuration');
	});

	it('unsubscribes and closes the connection on unmount', async () => {
		const setEntities = vi.fn();
		const unsubscribe = vi.fn();
		const close = vi.fn();
		const connection = { close };

		createLongLivedTokenAuth.mockReturnValue('auth');
		createConnection.mockResolvedValue(connection);
		subscribeEntities.mockReturnValue(unsubscribe);

		const { unmount } = render(
			<EntitiesContext.Provider value={{ entities: {}, setEntities }}>
				<HookProbe />
			</EntitiesContext.Provider>,
		);

		await waitFor(() => {
			expect(createConnection).toHaveBeenCalled();
		});

		unmount();

		expect(unsubscribe).toHaveBeenCalled();
		expect(close).toHaveBeenCalled();
	});

	it('closes late connections that resolve after unmount', async () => {
		const setEntities = vi.fn();
		const close = vi.fn();
		const connection = { close };

		createLongLivedTokenAuth.mockReturnValue('auth');
		createConnection.mockImplementation(
			() =>
				new Promise((resolve) => {
					setTimeout(() => resolve(connection), 0);
				}),
		);

		const { unmount } = render(
			<EntitiesContext.Provider value={{ entities: {}, setEntities }}>
				<HookProbe />
			</EntitiesContext.Provider>,
		);

		unmount();

		await waitFor(() => {
			expect(close).toHaveBeenCalled();
		});

		expect(subscribeEntities).not.toHaveBeenCalled();
	});
});
