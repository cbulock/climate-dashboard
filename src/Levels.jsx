import PropTypes from 'prop-types';
import styled from 'styled-components';

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

const Levels = ({ entities }) => (
	<>
		<Roof />
		<Wrapper>
			<Level>
				<Label>3</Label>
				<Temp>{Math.round(entities['sensor.upstairs_temp']?.state)}°</Temp>
				<Humidity>
					{Math.round(entities['sensor.upstairs_humidity']?.state)}%
				</Humidity>
			</Level>
			<Level>
				<Label>1</Label>
				<Temp>{Math.round(entities['sensor.main_floor_temp']?.state)}°</Temp>
				<Humidity>
					{Math.round(entities['sensor.main_floor_humidity']?.state)}%
				</Humidity>
			</Level>
			<Level>
				<Label>B</Label>
				<Temp>{Math.round(entities['sensor.basement_temp']?.state)}°</Temp>
				<Humidity>
					{Math.round(entities['sensor.basement_humidity']?.state)}%
				</Humidity>
			</Level>
		</Wrapper>
	</>
);

Levels.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	entities: PropTypes.object.isRequired,
};

export default Levels;
