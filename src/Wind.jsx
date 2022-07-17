import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
	grid-area: Wind;
	position: relative;
	z-index: 10;
`;

const Circle = styled.div`
	height: 16vw;
	width: 16vw;
	border-radius: 50%;
	background: rgb(2, 204, 255);
`;

const CaretWrapper = styled.div`
	position: absolute;
	top: 0vw;
	left: 50%;
	height: 16vw;
	transform: translate(-50%) rotate(${({ $direction }) => $direction}deg);
	transition: transform 1s;
`;

const Speed = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-weight: 900;
	font-size: 8vw;
`;
const SpeedLabel = styled.p`
	position: absolute;
	top: 12vw;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 1vw;
	margin: 0;
`;

const DirectionTicks = styled.div`
	position: absolute;
	top: -1vw;
	left: 50%;
	height: 18vw;
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

const Wind = ({ direction, speed }) => (
	<Wrapper>
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
	</Wrapper>
);

Wind.propTypes = {
	direction: PropTypes.number.isRequired,
	speed: PropTypes.number.isRequired,
};

export default Wind;
