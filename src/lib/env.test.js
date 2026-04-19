import { describe, expect, it, afterEach } from 'vitest';

import getHassConfig from './env';

const originalEnv = {
	VITE_HASS_URL: import.meta.env.VITE_HASS_URL,
	VITE_HASS_TOKEN: import.meta.env.VITE_HASS_TOKEN,
};

const restoreEnv = () => {
	import.meta.env.VITE_HASS_URL = originalEnv.VITE_HASS_URL;
	import.meta.env.VITE_HASS_TOKEN = originalEnv.VITE_HASS_TOKEN;
};

afterEach(() => {
	restoreEnv();
});

describe('getHassConfig', () => {
	it('returns config from VITE environment variables', () => {
		import.meta.env.VITE_HASS_URL = 'https://vite.example';
		import.meta.env.VITE_HASS_TOKEN = 'vite-token';

		expect(getHassConfig()).toEqual({
			url: 'https://vite.example',
			token: 'vite-token',
		});
	});

	it('throws when required Home Assistant config is missing', () => {
		delete import.meta.env.VITE_HASS_URL;
		delete import.meta.env.VITE_HASS_TOKEN;

		expect(() => getHassConfig()).toThrow(
			'Missing Home Assistant configuration. Set VITE_HASS_URL and VITE_HASS_TOKEN.',
		);
	});
});
