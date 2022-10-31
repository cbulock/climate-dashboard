import { useContext } from 'react';

import { EntitiesContext } from '../context/Entities';

const isNumeric = (value) =>
	!Number.isNaN(parseFloat(value)) && Number.isFinite(value);

const useHassState = (entity) => {
	const { entities } = useContext(EntitiesContext);
	const state = entities[entity]?.state;

	if (Number.isNaN(state)) return '?';
	return isNumeric(Number(state)) ? Math.round(state) : state;
};

export default useHassState;
