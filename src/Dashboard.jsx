import { useState, useEffect } from 'react';
import {
	createConnection,
	subscribeEntities,
	createLongLivedTokenAuth,
} from 'home-assistant-js-websocket';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faDroplet,
	faHotTubPerson,
	faWaterLadder,
} from '@fortawesome/free-solid-svg-icons';

const HumidityIcon = styled(FontAwesomeIcon)`
	padding-right: 0.3em;
`;

const LargerIcon = styled(FontAwesomeIcon)`
	padding-right: 0.2em;
`;

const TempContainer = styled.div`
	display: grid;
	width: fit-content;
	align-items: center;
`;

const Temp = styled.div`
	font-weight: 900;
	line-height: 1;
	grid-column: span 2;
`;

const LocationLabel = styled.p`
	font-size: 2rem;
	font-variant-caps: small-caps;
	margin: 0;
`;

const Main = styled.main`
	align-items: center;
	justify-content: center;
	display: grid;
	grid-template-columns: 50% auto;
	grid-template-areas:
		'Outdoors Indoors'
		'Pool HotTub';
	height: 100vh;
	background: rgb(2, 204, 255);
	color: white;
	padding: 1em;
`;

const Outdoors = styled(TempContainer)`
	grid-area: Outdoors;
`;
const OutdoorTemp = styled(Temp)`
	font-size: 12rem;
`;
const OutdoorHumidity = styled.div`
	font-size: 2rem;
	justify-self: end;
`;

const Indoors = styled(TempContainer)`
	grid-area: Indoors;
`;
const IndoorTemp = styled(Temp)`
	font-size: 8rem;
`;
const IndoorHumidity = styled.div`
	font-size: 1.5rem;
	justify-self: end;
`;

const Pool = styled.div`
	grid-area: Pool;
`;
const PoolTemp = styled.div`
	font-size: 5rem;
	font-weight: 900;
`;

const HotTub = styled.div`
	grid-area: HotTub;
`;
const HotTubTemp = styled.div`
	font-size: 5rem;
	font-weight: 900;
`;

const Dashboard = () => {
	const [entities, setEntities] = useState({});

	useEffect(() => {
		const subscribe = async () => {
			const auth = createLongLivedTokenAuth(
				'https://bulock.house',
				'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1YWMwYjg3MGMyMTc0Y2IyYjRkY2I2ZWFhY2MyZWE0NyIsImlhdCI6MTY1NTc4MDM4NSwiZXhwIjoxOTcxMTQwMzg1fQ.mLogPoQkWjZMQZPCPAE7Inr-ZJJal7BhuXxjgVclCc8',
			);

			const connection = await createConnection({ auth });
			subscribeEntities(connection, (e) => setEntities(e));
		};
		subscribe();
	}, []);

	return (
		<Main>
			<Outdoors>
				<OutdoorTemp>
					{Math.round(entities['sensor.outdoor_temp']?.state)}°
				</OutdoorTemp>
				<LocationLabel>Outdoors</LocationLabel>
				<OutdoorHumidity>
					<HumidityIcon icon={faDroplet} />
					{Math.round(entities['sensor.outdoor_humidity']?.state)}%
				</OutdoorHumidity>
			</Outdoors>
			<Indoors>
				<IndoorTemp>
					{Math.round(entities['sensor.indoor_temp']?.state)}°
				</IndoorTemp>
				<LocationLabel>Indoors</LocationLabel>
				<IndoorHumidity>
					<HumidityIcon icon={faDroplet} />
					{Math.round(entities['sensor.indoor_humidity']?.state)}%
				</IndoorHumidity>
			</Indoors>
			<Pool>
				<PoolTemp>
					<LargerIcon icon={faWaterLadder} />
					{Math.round(entities['sensor.pool_temp']?.state)}°
				</PoolTemp>
			</Pool>
			<HotTub>
				<HotTubTemp>
					<LargerIcon icon={faHotTubPerson} />
					{Math.round(entities['sensor.hot_tub_temp']?.state)}°
				</HotTubTemp>
			</HotTub>
		</Main>
	);
};

export default Dashboard;
