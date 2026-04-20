import styled from 'styled-components';

import useHassState from '../hooks/useHassState';
import { Panel, PanelInner, PanelTitle } from './ui/PanelPrimitives';

const Wrapper = styled(Panel).attrs({
	role: 'region',
	'aria-labelledby': 'levels-heading',
})`
	grid-area: Levels;
`;

const Level = styled.div`
	display: grid;
	grid-template-columns: minmax(2.25rem, 3rem) minmax(0, 1fr) auto;
	align-items: center;
	gap: var(--space-md);
	padding: var(--space-md);
	border-radius: var(--radius-lg);
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid rgba(255, 255, 255, 0.06);

	@media (max-width: 700px) and (min-height: 900px) {
		grid-template-columns: 1fr;
		justify-items: center;
		gap: 0.35rem;
		padding: 0.7rem 0.5rem;
		text-align: center;
	}
`;

const LevelsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.85rem;

	@media (min-width: 900px) and (max-width: 1400px) and (min-aspect-ratio: 4/3) {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	@media (max-width: 700px) and (min-height: 900px) {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.55rem;
	}
`;

const LevelItem = styled.div`
	margin: 0;
	font-size: clamp(1rem, 2.2vw, 1.15rem);

	@media (max-width: 700px) and (min-height: 900px) {
		font-size: 0.92rem;
	}
`;

const Label = styled(LevelItem)`
	display: grid;
	place-items: center;
	min-height: 2.75rem;
	border-radius: 0.95rem;
	font-weight: 900;
	color: var(--bg-base);
	background: linear-gradient(135deg, #f8fafc, #cbd5e1);

	@media (max-width: 700px) and (min-height: 900px) {
		min-width: 2rem;
		min-height: 2rem;
		padding: 0 0.45rem;
	}
`;
const Temp = styled(LevelItem)`
	font-weight: 700;
	color: var(--text-primary);
`;
const Humidity = styled(LevelItem)`
	justify-self: end;
	color: var(--text-secondary);

	@media (max-width: 700px) and (min-height: 900px) {
		justify-self: center;
	}
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
			<PanelInner>
				<div>
					<PanelTitle id="levels-heading">Home levels</PanelTitle>
				</div>
				<LevelsList>
					<Level>
						<Label>B</Label>
						<Temp>{basementTemp}°</Temp>
						<Humidity>{basementHumidity}%</Humidity>
					</Level>
					<Level>
						<Label>1</Label>
						<Temp>{mainFloorTemp}°</Temp>
						<Humidity>{mainFloorHumidity}%</Humidity>
					</Level>
					<Level>
						<Label>2</Label>
						<Temp>{upstairsTemp}°</Temp>
						<Humidity>{upstairsHumidity}%</Humidity>
					</Level>
				</LevelsList>
			</PanelInner>
		</Wrapper>
	);
};

export default Levels;
