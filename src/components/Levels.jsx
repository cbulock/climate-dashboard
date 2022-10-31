import styled from 'styled-components';

import useHassState from '../hooks/useHassState';

const Wrapper = styled.div`
	grid-area: Levels;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: white;
	padding: 1vh 3vh;
	border-radius: 1vh;
`;

const Roof = styled.div``;

const Level = styled.div`
	display: grid;
	background: rgb(2, 204, 255);
	border-radius: 4vh;
	padding: 1.5vh;
	margin: 1vh;
	grid-template-columns: 3vh auto auto;
	grid-template-areas: 'Label Temp Humidity';
	gap: 2vh;
`;

const LevelItem = styled.p`
	font-size: 2vh;
	margin: 0;
`;

const Label = styled(LevelItem)`
	grid-area: Label;
	font-weight: 900;
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
		<>
			<Roof />
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
		</>
	);
};

export default Levels;
