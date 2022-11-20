import styled from 'styled-components';

import useHassState from '../hooks/useHassState';

const Wrapper = styled.div`
	grid-area: Levels;
	display: flex;
	flex-direction: column;
`;

const Level = styled.div`
	display: grid;
	border: 3px solid white;
	border-radius: 4vh;
	margin: 1vh;
	grid-template-columns: 3vh auto auto;
	grid-template-areas: 'Label Temp Humidity';
	gap: 2vh;
`;

const LevelItem = styled.p`
	font-size: 3vh;
	padding: 1.5vh;
	margin: 0;
`;

const Label = styled(LevelItem)`
	grid-area: Label;
	justify-self: center;
	margin: -3px; // why?
	padding: calc(1.5vh + 3px);
	border-radius: 4vh 0 0 4vh;
	font-weight: 900;
	color: rgb(2, 204, 255);
	background: white;
`;
const Temp = styled(LevelItem)`
	grid-area: Temp;
`;
const Humidity = styled(LevelItem)`
	grid-area: Humidity;
`;

const Levels = () => {
	const upstairsTemp = useHassState('sensor.upstairs_temp');
	const upstairsHumidity = useHassState('sensor.upstairs_humidity');
	const mainFloorTemp = useHassState('sensor.main_floor_temp');
	const mainFloorHumidity = useHassState('sensor.main_floor_humidity');
	const basementTemp = useHassState('sensor.basement_temp');
	const basementHumidity = useHassState('sensor.basement_humidity');

	return (
		<Wrapper>
			<Level>
				<Label>2</Label>
				<Temp>{upstairsTemp}°</Temp>
				<Humidity>{upstairsHumidity}%</Humidity>
			</Level>
			<Level>
				<Label>1</Label>
				<Temp>{mainFloorTemp}°</Temp>
				<Humidity>{mainFloorHumidity}%</Humidity>
			</Level>
			<Level>
				<Label>B</Label>
				<Temp>{basementTemp}°</Temp>
				<Humidity>{basementHumidity}%</Humidity>
			</Level>
		</Wrapper>
	);
};

export default Levels;
