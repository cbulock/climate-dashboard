const getUvRisk = (value) => {
	const uvIndex = Number(value);

	if (!Number.isFinite(uvIndex) || uvIndex < 6) return null;
	if (uvIndex < 8) return { label: 'High UV', level: 'high' };
	if (uvIndex < 11) return { label: 'Very high UV', level: 'very-high' };
	return { label: 'Extreme UV', level: 'extreme' };
};

export default getUvRisk;
