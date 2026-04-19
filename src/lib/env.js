const getImportMetaEnv = () =>
	typeof import.meta !== 'undefined' ? (import.meta.env ?? {}) : {};

const isEnabled = (value) =>
	typeof value === 'string' &&
	['1', 'true', 'yes', 'on'].includes(value.toLowerCase());

const getHassConfig = () => {
	const env = getImportMetaEnv();
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
	const env = getImportMetaEnv();

	return isEnabled(env.VITE_ENABLE_HOT_TUB);
};

export default getHassConfig;
