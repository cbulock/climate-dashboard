import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faWind } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
	grid-area: Wind;
	display: grid;
	align-items: center;
	justify-items: center;
	grid-template-areas:
		'.      North   .'
		'West   Main    East'
		'.      South   .';
`;

const CircleWrapper = styled.div`
	grid-area: Main;
	position: relative;
	z-index: 10;
`;

const Circle = styled.div`
	height: 20vw;
	width: 20vw;
	border-radius: 50%;
	background: rgb(2, 204, 255);
`;

const CaretWrapper = styled.div`
	position: absolute;
	top: -0.5vw;
	left: 50%;
	height: 21vw;
	transform: translate(-50%) rotate(${({ $direction }) => $direction}deg);
	transition: transform 1s;
`;

const Speed = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-weight: 900;
	font-size: 12vw;
`;
const SpeedLabel = styled.p`
	position: absolute;
	top: 16vw;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 1.5vw;
	margin: 0;
`;

const DirectionTicks = styled.div`
	position: absolute;
	top: -1vw;
	left: 50%;
	height: 22vw;
	transform: translate(0, -50%);
	z-index: -1;
`;

const DirectionTick = styled.div`
	position: absolute;
	top: 50%;
	width: 0.8vw;
	height: 100%;
	background: white;
`;

const Direction1 = styled(DirectionTick)`
	transform: translate(-50%);
`;
const Direction2 = styled(DirectionTick)`
	transform: translate(-50%) rotate(45deg);
`;
const Direction3 = styled(DirectionTick)`
	transform: translate(-50%) rotate(90deg);
`;
const Direction4 = styled(DirectionTick)`
	transform: translate(-50%) rotate(135deg);
`;

const Caret = styled(FontAwesomeIcon)`
	font-size: 4vw;
`;

const WindIcon = styled(FontAwesomeIcon)``;

const DirectionLabel = styled.p`
	margin: 2.5vw;
	font-size: 2.5vw;
`;

const North = styled(DirectionLabel)`
	grid-area: North;
`;
const South = styled(DirectionLabel)`
	grid-area: South;
`;
const East = styled(DirectionLabel)`
	grid-area: East;
`;
const West = styled(DirectionLabel)`
	grid-area: West;
`;

const Wind = ({ direction, speed }) => (
	<Wrapper>
		<North>N</North>
		<South>S</South>
		<East>E</East>
		<West>W</West>
		<CircleWrapper>
			<Circle />
			<CaretWrapper $direction={direction}>
				<Caret icon={faCaretUp} />
			</CaretWrapper>
			<Speed>{speed}</Speed>
			<SpeedLabel>MPH</SpeedLabel>
			<DirectionTicks>
				<Direction1 />
				<Direction2 />
				<Direction3 />
				<Direction4 />
			</DirectionTicks>
		</CircleWrapper>
		<WindIcon icon={faWind} />
	</Wrapper>
);

Wind.propTypes = {
	direction: PropTypes.number.isRequired,
	speed: PropTypes.number.isRequired,
};

export default Wind;
