import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

import useHassState from '../hooks/useHassState';
import { Panel, PanelInner, PanelTitle } from './ui/PanelPrimitives';

const Wrapper = styled(Panel).attrs({
	role: 'region',
	'aria-labelledby': 'wind-heading',
})`
	grid-area: Wind;
	min-height: 16rem;
`;

const CircleWrapper = styled.div`
	position: relative;
	display: grid;
	place-items: center;
	margin: 0 auto;
	width: min(100%, 12.5rem);
	aspect-ratio: 1;
	height: auto;
`;

const DialFace = styled.div`
	position: absolute;
	inset: 0;
	border-radius: 50%;
	overflow: hidden;
`;

const Circle = styled.div`
	position: absolute;
	inset: 0;
	border-radius: 50%;
	background: radial-gradient(
		circle,
		rgba(8, 15, 28, 0.75),
		rgba(6, 11, 20, 1)
	);
	border: 1px solid rgba(255, 255, 255, 0.08);
	box-shadow: inset 0 0 24px rgba(255, 255, 255, 0.04);
	z-index: 0;
`;

const CaretWrapper = styled.div`
	position: absolute;
	top: 0;
	left: 50%;
	height: 100%;
	transform: translate(-50%) rotate(${({ $direction }) => $direction}deg);
	transition: transform 1s;
	z-index: 4;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

const Speed = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-weight: 900;
	font-size: clamp(2.8rem, 9vw, 4rem);
	line-height: 0.95;
	z-index: 2;
`;
const SpeedLabel = styled.p`
	position: absolute;
	top: calc(50% + 2.15rem);
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 0.68rem;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: var(--text-muted);
	margin: 0;
	z-index: 2;
`;

const DirectionTicks = styled.div`
	position: absolute;
	inset: 0;
	z-index: 1;
`;

const DirectionTick = styled.div`
	position: absolute;
	top: 0;
	left: 50%;
	width: clamp(0.2rem, 0.4vw, 0.35rem);
	height: 100%;
	background: rgba(255, 255, 255, 0.1);
`;

const TickMask = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	width: 78%;
	height: 78%;
	transform: translate(-50%, -50%);
	border-radius: 50%;
	background: radial-gradient(
		circle,
		rgba(8, 15, 28, 0.92),
		rgba(6, 11, 20, 0.98)
	);
	box-shadow: inset 0 0 16px rgba(255, 255, 255, 0.02);
	z-index: 1;
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
	font-size: clamp(2rem, 4vw, 2.85rem);
	color: var(--accent-cyan);
`;

const DirectionLabel = styled.p`
	position: absolute;
	display: grid;
	place-items: center;
	margin: 0;
	min-width: 2rem;
	min-height: 2rem;
	padding: 0 0.3rem;
	border-radius: 999px;
	font-size: 0.82rem;
	font-weight: 800;
	letter-spacing: 0.08em;
	color: rgba(248, 250, 252, 0.72);
	background: rgba(6, 11, 20, 0.92);
	box-shadow:
		0 0 0 0.35rem rgba(6, 11, 20, 0.55),
		0 0 18px rgba(2, 6, 23, 0.45);
	text-shadow: 0 0 18px rgba(2, 6, 23, 0.75);
	z-index: 3;
	min-width: 1.7rem;
	min-height: 1.7rem;
`;

const North = styled(DirectionLabel)`
	top: 0.55rem;
	left: 50%;
	transform: translateX(-50%);
`;
const South = styled(DirectionLabel)`
	bottom: 0.55rem;
	left: 50%;
	transform: translateX(-50%);
`;
const East = styled(DirectionLabel)`
	top: 50%;
	right: 0.55rem;
	transform: translateY(-50%);
`;
const West = styled(DirectionLabel)`
	top: 50%;
	left: 0.55rem;
	transform: translateY(-50%);
`;

const WindBody = styled.div`
	display: flex;
	justify-content: center;
	flex: 1;
	align-items: center;
`;

const Wind = () => {
	const speed = useHassState('sensor.wind_avg');
	const direction = useHassState('sensor.wind_direction');

	return (
		<Wrapper>
			<PanelInner>
				<div>
					<PanelTitle id="wind-heading">Wind</PanelTitle>
				</div>
				<WindBody>
					<CircleWrapper>
						<North>N</North>
						<South>S</South>
						<East>E</East>
						<West>W</West>
						<DialFace>
							<Circle />
							<DirectionTicks>
								<Direction1 />
								<Direction2 />
								<Direction3 />
								<Direction4 />
							</DirectionTicks>
							<TickMask />
							<CaretWrapper $direction={direction}>
								<Caret icon={faCaretUp} />
							</CaretWrapper>
							<Speed>{speed}</Speed>
							<SpeedLabel>MPH</SpeedLabel>
						</DialFace>
					</CircleWrapper>
				</WindBody>
			</PanelInner>
		</Wrapper>
	);
};

export default Wind;
