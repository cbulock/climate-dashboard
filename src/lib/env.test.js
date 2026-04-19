import { describe, expect, it, afterEach } from 'vitest';

import getHassConfig from './env';

const originalEnv = {
	VITE_HASS_URL: import.meta.env.VITE_HASS_URL,
	VITE_HASS_TOKEN: import.meta.env.VITE_HASS_TOKEN,
	REACT_APP_HASS_URL: import.meta.env.REACT_APP_HASS_URL,
	REACT_APP_HASS_TOKEN: import.meta.env.REACT_APP_HASS_TOKEN,
};

const restoreEnv = () => {
	import.meta.env.VITE_HASS_URL = originalEnv.VITE_HASS_URL;
	import.meta.env.VITE_HASS_TOKEN = originalEnv.VITE_HASS_TOKEN;
	import.meta.env.REACT_APP_HASS_URL = originalEnv.REACT_APP_HASS_URL;
	import.meta.env.REACT_APP_HASS_TOKEN = originalEnv.REACT_APP_HASS_TOKEN;
};

afterEach(() => {
	restoreEnv();
});

describe('getHassConfig', () => {
	it('prefers VITE environment variables', () => {
		import.meta.env.VITE_HASS_URL = 'https://vite.example';
		import.meta.env.VITE_HASS_TOKEN = 'vite-token';
		import.meta.env.REACT_APP_HASS_URL = 'https://legacy.example';
		import.meta.env.REACT_APP_HASS_TOKEN = 'legacy-token';

		expect(getHassConfig()).toEqual({
			url: 'https://vite.example',
			token: 'vite-token',
		});
	});

	it('falls back to legacy REACT_APP variables', () => {
		delete import.meta.env.VITE_HASS_URL;
		delete import.meta.env.VITE_HASS_TOKEN;
		import.meta.env.REACT_APP_HASS_URL = 'https://legacy.example';
		import.meta.env.REACT_APP_HASS_TOKEN = 'legacy-token';

		expect(getHassConfig()).toEqual({
			url: 'https://legacy.example',
			token: 'legacy-token',
		});
	});

	it('throws when required Home Assistant config is missing', () => {
		delete import.meta.env.VITE_HASS_URL;
		delete import.meta.env.VITE_HASS_TOKEN;
		delete import.meta.env.REACT_APP_HASS_URL;
		delete import.meta.env.REACT_APP_HASS_TOKEN;

		expect(() => getHassConfig()).toThrow(
			'Missing Home Assistant configuration. Set VITE_HASS_URL and VITE_HASS_TOKEN.',
		);
	});
});
