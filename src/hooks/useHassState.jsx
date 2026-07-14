import { useContext } from 'react';

import { EntitiesContext } from '../context/Entities';

const isNumeric = (value) =>
	!Number.isNaN(parseFloat(value)) && Number.isFinite(value);

const useHassState = (entity, roundNumeric = true) => {
	const { entities } = useContext(EntitiesContext);
	const state = entities[entity]?.state;

	if (Number.isNaN(state)) return '?';
	if (!isNumeric(Number(state))) return state;

	return roundNumeric ? Math.round(state) : Number(state);
};

export default useHassState;
