import { useContext } from 'react';

import { EntitiesContext } from '../context/Entities';

const useToasts = () => {
	const { entities } = useContext(EntitiesContext);

	const alerts = entities['switch.alerts']?.attributes?.data;

	return alerts || [];
};

export default useToasts;
