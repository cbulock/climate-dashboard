const getImportMetaEnv = () =>
	typeof import.meta !== 'undefined' ? (import.meta.env ?? {}) : {};

const RUNTIME_CONFIG_KEY = '__CLIMATE_DASHBOARD_CONFIG__';

const getRuntimeEnv = () =>
	typeof window !== 'undefined' ? (window[RUNTIME_CONFIG_KEY] ?? {}) : {};

const getAppEnv = () => ({
	...getImportMetaEnv(),
	...getRuntimeEnv(),
});

const isEnabled = (value) =>
	typeof value === 'string' &&
	['1', 'true', 'yes', 'on'].includes(value.toLowerCase());

const getHassConfig = () => {
	const env = getAppEnv();
	const url = env.VITE_HASS_URL;
	const token = env.VITE_HASS_TOKEN;

	if (!url || !token) {
		throw new Error(
			'Missing Home Assistant configuration. Set VITE_HASS_URL and VITE_HASS_TOKEN.',
		);
	}

	return { url, token };
};

export const isHotTubEnabled = () => {
	const env = getAppEnv();

	return isEnabled(env.VITE_ENABLE_HOT_TUB);
};

export default getHassConfig;
