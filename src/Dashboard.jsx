import { useState, useEffect } from 'react';
import {
	createConnection,
	subscribeEntities,
	createLongLivedTokenAuth,
} from 'home-assistant-js-websocket';
import styled, { keyframes } from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowUpFromWaterPump,
	faDroplet,
	faHotTubPerson,
	faWaterLadder,
} from '@fortawesome/free-solid-svg-icons';

import Wind from './Wind';

const pulse = keyframes`
	0% {
		opacity: 1;
	}

	70% {
		opacity: 0.5;
	}

	100% {
		opacity: 1;
	}
`;

const HumidityIcon = styled(FontAwesomeIcon)`
	padding-right: 1vw;
`;

const LargerIcon = styled(FontAwesomeIcon)`
	padding-right: 0.8vw;
`;

const PumpIcon = styled(FontAwesomeIcon)`
	font-size: 3vw;
	justify-self: end;
	padding-right: 3vw;
	animation: ${pulse} 2s infinite;
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
	font-variant-caps: small-caps;
	margin: 0;
`;

const Main = styled.main`
	align-items: center;
	justify-items: center;
	display: grid;
	grid-template-columns: 50% 50%;
	grid-template-rows: auto;
	grid-template-areas:
		'Outdoors Pool'
		'Indoors HotTub'
		'. Wind';
	height: 100vh;
	background: rgb(2, 204, 255);
	color: white;
`;

const Outdoors = styled(TempContainer)`
	grid-area: Outdoors;
`;
const OutdoorTemp = styled(Temp)`
	font-size: 25vw;
`;
const OutdoorHumidity = styled.div`
	font-size: 4vw;
	justify-self: end;
`;
const OutdoorLabel = styled(LocationLabel)`
	font-size: 4vw;
`;

const Indoors = styled(TempContainer)`
	grid-area: Indoors;
`;
const IndoorTemp = styled(Temp)`
	font-size: 18vw;
`;
const IndoorHumidity = styled.div`
	font-size: 3.5vw;
	justify-self: end;
`;
const IndoorLabel = styled(LocationLabel)`
	font-size: 3.5vw;
`;

const Pool = styled.div`
	width: fit-content;
	grid-area: Pool;
	display: grid;
`;
const PoolTemp = styled.div`
	font-size: 12vw;
	font-weight: 900;
`;

const HotTub = styled.div`
	grid-area: HotTub;
`;
const HotTubTemp = styled.div`
	font-size: 12vw;
	font-weight: 900;
`;

const Dashboard = () => {
	const [entities, setEntities] = useState({});

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

	return (
		<Main>
			<Outdoors>
				<OutdoorTemp>
					{Math.round(entities['sensor.outdoor_temp']?.state)}°
				</OutdoorTemp>
				<OutdoorLabel>Outdoors</OutdoorLabel>
				<OutdoorHumidity>
					<HumidityIcon icon={faDroplet} />
					{Math.round(entities['sensor.outdoor_humidity']?.state)}%
				</OutdoorHumidity>
			</Outdoors>
			<Indoors>
				<IndoorTemp>
					{Math.round(entities['sensor.indoor_temp']?.state)}°
				</IndoorTemp>
				<IndoorLabel>Indoors</IndoorLabel>
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
				{entities['switch.pool_pump']?.state === 'on' && (
					<PumpIcon icon={faArrowUpFromWaterPump} />
				)}
			</Pool>
			<HotTub>
				<HotTubTemp>
					<LargerIcon icon={faHotTubPerson} />
					{Math.round(entities['sensor.hot_tub_temp']?.state)}°
				</HotTubTemp>
			</HotTub>
			<Wind
				speed={Math.round(entities['sensor.wind_avg']?.state)}
				direction={entities['sensor.wind_direction']?.state}
			/>
		</Main>
	);
};

export default Dashboard;
