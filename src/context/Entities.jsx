import { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const EntitiesContext = createContext();

const EntitiesProvider = ({ children }) => {
	const [entities, setEntities] = useState({});
	const [connection, setConnection] = useState(null);

	const value = useMemo(
		() => ({ entities, setEntities, connection, setConnection }),
		[connection, entities],
	);

	return (
		<EntitiesContext.Provider value={value}>
			{children}
		</EntitiesContext.Provider>
	);
};

EntitiesProvider.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
};

export { EntitiesContext, EntitiesProvider };
