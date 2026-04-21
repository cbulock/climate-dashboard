import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';

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
	grid-template-columns: minmax(2.5rem, 3rem) minmax(0, 1fr) auto;
	align-items: center;
	gap: 0.85rem;
	padding: 0.85rem 0.9rem;
	border-radius: var(--radius-lg);
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid rgba(255, 255, 255, 0.06);
`;

const LevelsList = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 0.7rem;
`;

const LevelItem = styled.div`
	margin: 0;
	font-size: 1.05rem;
`;

const Label = styled(LevelItem)`
	display: grid;
	place-items: center;
	min-height: 2.75rem;
	border-radius: 0.95rem;
	font-weight: 900;
	color: var(--bg-base);
	background: linear-gradient(135deg, #f8fafc, #cbd5e1);
	min-width: 2rem;
	min-height: 2rem;
	padding: 0 0.45rem;
`;
const Temp = styled(LevelItem)`
	font-weight: 700;
	color: var(--text-primary);
`;
const Humidity = styled(LevelItem)`
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	justify-self: end;
	color: var(--text-secondary);
`;

const HumidityIcon = styled(FontAwesomeIcon)`
	font-size: 0.8rem;
	color: var(--accent-cyan);
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
						<Humidity>
							<HumidityIcon icon={faDroplet} />
							{basementHumidity}%
						</Humidity>
					</Level>
					<Level>
						<Label>1</Label>
						<Temp>{mainFloorTemp}°</Temp>
						<Humidity>
							<HumidityIcon icon={faDroplet} />
							{mainFloorHumidity}%
						</Humidity>
					</Level>
					<Level>
						<Label>2</Label>
						<Temp>{upstairsTemp}°</Temp>
						<Humidity>
							<HumidityIcon icon={faDroplet} />
							{upstairsHumidity}%
						</Humidity>
					</Level>
				</LevelsList>
			</PanelInner>
		</Wrapper>
	);
};

export default Levels;
