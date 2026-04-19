import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet, faHotTubPerson } from '@fortawesome/free-solid-svg-icons';

import useSubscribe from './hooks/useSubscribe';
import useHassState from './hooks/useHassState';
import { isHotTubEnabled } from './lib/env';

import Levels from './components/Levels';
import Wind from './components/Wind';

const HumidityIcon = styled(FontAwesomeIcon)`
	padding-right: 1vw;
`;

const LargerIcon = styled(FontAwesomeIcon)`
	padding-right: 0.8vw;
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
	grid-template-areas: ${({ $showHotTub }) =>
		$showHotTub
			? "'Outdoors HotTub' 'Indoors Wind' 'Levels Wind'"
			: "'Outdoors Wind' 'Indoors Wind' 'Levels Wind'"};
	height: 100vh;
	background: black;
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

const HotTub = styled.div`
	grid-area: HotTub;
`;
const HotTubTemp = styled.div`
	font-size: 12vw;
	font-weight: 900;
`;

const Dashboard = () => {
	useSubscribe();
	const showHotTub = isHotTubEnabled();

	const outdoorTemp = useHassState('sensor.outdoor_temp');
	const indoorTemp = useHassState('sensor.indoor_temp');
	const outdoorHumidity = useHassState('sensor.outdoor_humidity');
	const indoorHumidity = useHassState('sensor.indoor_humidity');

	const hotTubTemp = useHassState('sensor.hot_tub_temp');

	return (
		<Main $showHotTub={showHotTub}>
			<Outdoors>
				<OutdoorTemp>{outdoorTemp}°</OutdoorTemp>
				<OutdoorLabel>Outdoors</OutdoorLabel>
				<OutdoorHumidity>
					<HumidityIcon icon={faDroplet} />
					{outdoorHumidity}%
				</OutdoorHumidity>
			</Outdoors>
			<Indoors>
				<IndoorTemp>{indoorTemp}°</IndoorTemp>
				<IndoorLabel>Indoors</IndoorLabel>
				<IndoorHumidity>
					<HumidityIcon icon={faDroplet} />
					{indoorHumidity}%
				</IndoorHumidity>
			</Indoors>
			{showHotTub && (
				<HotTub>
					<HotTubTemp>
						<LargerIcon icon={faHotTubPerson} />
						{hotTubTemp}°
					</HotTubTemp>
				</HotTub>
			)}
			<Levels />
			<Wind />
		</Main>
	);
};

export default Dashboard;
