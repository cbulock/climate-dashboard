const getImportMetaEnv = () =>
	typeof import.meta !== 'undefined' ? (import.meta.env ?? {}) : {};

const getHassConfig = () => {
	const env = getImportMetaEnv();
	const url = env.VITE_HASS_URL ?? env.REACT_APP_HASS_URL;
	const token = env.VITE_HASS_TOKEN ?? env.REACT_APP_HASS_TOKEN;

	if (!url || !token) {
		throw new Error(
			'Missing Home Assistant configuration. Set VITE_HASS_URL and VITE_HASS_TOKEN.',
		);
	}

	return { url, token };
};

export default getHassConfig;
