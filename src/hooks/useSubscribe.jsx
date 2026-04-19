import { useContext, useEffect } from 'react';

import {
	createConnection,
	subscribeEntities,
	createLongLivedTokenAuth,
} from 'home-assistant-js-websocket';

import { EntitiesContext } from '../context/Entities';
import getHassConfig from '../lib/env';

const useSubscribe = () => {
	const { setEntities } = useContext(EntitiesContext);

	useEffect(() => {
		const { url, token } = getHassConfig();
		let connection;
		let unsubscribe;
		let isActive = true;

		const subscribe = async () => {
			const auth = createLongLivedTokenAuth(url, token);

			const nextConnection = await createConnection({ auth });

			if (!isActive) {
				nextConnection.close();
				return;
			}

			connection = nextConnection;
			unsubscribe = subscribeEntities(connection, (entities) => {
				if (isActive) {
					setEntities(entities);
				}
			});
		};

		subscribe();

		return () => {
			isActive = false;
			unsubscribe?.();
			connection?.close();
		};
	}, [setEntities]);
};

export default useSubscribe;
