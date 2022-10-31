import { useContext, useEffect } from 'react';

import {
	createConnection,
	subscribeEntities,
	createLongLivedTokenAuth,
} from 'home-assistant-js-websocket';

import { EntitiesContext } from '../context/Entities';

const useSubscribe = () => {
	const { setEntities } = useContext(EntitiesContext);

	useEffect(() => {
		const subscribe = async () => {
			const auth = createLongLivedTokenAuth(
				// eslint-disable-next-line no-undef
				process.env.REACT_APP_HASS_URL,
				// eslint-disable-next-line no-undef
				process.env.REACT_APP_HASS_TOKEN,
			);

			const connection = await createConnection({ auth });
			subscribeEntities(connection, (e) => setEntities(e));
		};
		subscribe();
	}, []);
};

export default useSubscribe;
