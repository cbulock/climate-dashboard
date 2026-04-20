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

	@media (max-width: 700px) and (min-height: 900px) {
		min-height: 16rem;
	}
`;

const CircleWrapper = styled.div`
	position: relative;
	display: grid;
	place-items: center;
	margin: 0 auto;
	width: clamp(12rem, 22vw, 18rem);
	height: clamp(12rem, 22vw, 18rem);

	@media (min-width: 900px) and (max-width: 1400px) and (min-aspect-ratio: 4/3) {
		width: min(32vh, 17rem);
		height: min(32vh, 17rem);
	}

	@media (max-width: 700px) and (min-height: 900px) {
		width: min(100%, 12.5rem);
		aspect-ratio: 1;
		height: auto;
	}
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
	z-index: 2;

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
	font-size: clamp(3rem, 9vw, 6rem);
	line-height: 0.95;
	z-index: 2;

	@media (max-width: 700px) and (min-height: 900px) {
		font-size: clamp(2.8rem, 9vw, 4rem);
	}
`;
const SpeedLabel = styled.p`
	position: absolute;
	top: calc(50% + 3rem);
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 0.82rem;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: var(--text-muted);
	margin: 0;
	z-index: 2;

	@media (max-width: 700px) and (min-height: 900px) {
		top: calc(50% + 2.15rem);
		font-size: 0.68rem;
	}
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
	font-size: 1rem;
	font-weight: 800;
	letter-spacing: 0.08em;
	color: rgba(248, 250, 252, 0.72);
	background: rgba(6, 11, 20, 0.92);
	box-shadow:
		0 0 0 0.35rem rgba(6, 11, 20, 0.55),
		0 0 18px rgba(2, 6, 23, 0.45);
	text-shadow: 0 0 18px rgba(2, 6, 23, 0.75);
	z-index: 3;

	@media (max-width: 700px) and (min-height: 900px) {
		min-width: 1.7rem;
		min-height: 1.7rem;
		font-size: 0.82rem;
	}
`;

const North = styled(DirectionLabel)`
	top: 0.85rem;
	left: 50%;
	transform: translateX(-50%);

	@media (max-width: 700px) and (min-height: 900px) {
		top: 0.55rem;
	}
`;
const South = styled(DirectionLabel)`
	bottom: 0.85rem;
	left: 50%;
	transform: translateX(-50%);

	@media (max-width: 700px) and (min-height: 900px) {
		bottom: 0.55rem;
	}
`;
const East = styled(DirectionLabel)`
	top: 50%;
	right: 0.85rem;
	transform: translateY(-50%);

	@media (max-width: 700px) and (min-height: 900px) {
		right: 0.55rem;
	}
`;
const West = styled(DirectionLabel)`
	top: 50%;
	left: 0.85rem;
	transform: translateY(-50%);

	@media (max-width: 700px) and (min-height: 900px) {
		left: 0.55rem;
	}
`;

const WindBody = styled.div`
	display: flex;
	justify-content: center;

	@media (max-width: 700px) and (min-height: 900px) {
		flex: 1;
		align-items: center;
	}
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
