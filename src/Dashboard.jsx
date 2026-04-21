import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet, faHotTubPerson } from '@fortawesome/free-solid-svg-icons';

import useSubscribe from './hooks/useSubscribe';
import useHassState from './hooks/useHassState';
import { isHotTubEnabled } from './lib/env';

import Levels from './components/Levels';
import Wind from './components/Wind';
import {
	AccentBadge,
	AutoFitHeroValue,
	MetricRow,
	Panel,
	PanelInner,
	PanelTitle,
	SubtleText,
} from './components/ui/PanelPrimitives';

const HumidityBadge = styled(AccentBadge)`
	font-size: 1.5rem;
	font-weight: 700;
	padding: 0.5rem 0.9rem;
`;

const HumidityIcon = styled(FontAwesomeIcon)`
	font-size: 1.2rem;
	color: var(--accent-cyan);
`;

const LargerIcon = styled(FontAwesomeIcon)`
	font-size: 1.15rem;
	color: var(--accent-amber);
`;

const Main = styled.main`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	grid-template-areas: ${({ $showHotTub }) =>
		$showHotTub
			? "'Outdoors Outdoors' 'Indoors Indoors' 'Levels Wind' 'HotTub HotTub'"
			: "'Outdoors Outdoors' 'Indoors Indoors' 'Levels Wind'"};
	grid-template-rows: ${({ $showHotTub }) =>
		$showHotTub
			? 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 1fr)'
			: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr)'};
	gap: 0.7rem;
	width: 100%;
	min-height: 100dvh;
	margin: 0 auto;
	padding: 0.7rem;
	overflow: hidden;
`;

const ClimatePanel = styled(Panel)`
	min-height: 0;
`;

const Outdoors = styled(ClimatePanel).attrs({
	role: 'region',
	'aria-labelledby': 'outdoor-climate-heading',
})`
	grid-area: Outdoors;
`;
const IndoorPanel = styled(ClimatePanel).attrs({
	role: 'region',
	'aria-labelledby': 'indoor-climate-heading',
})`
	grid-area: Indoors;
`;
const HotTub = styled(Panel).attrs({
	role: 'region',
	'aria-labelledby': 'hot-tub-heading',
})`
	grid-area: HotTub;
	min-height: 0;
`;
const ClimateHeader = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 0.6rem;
`;
const ClimateMeta = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
`;
const HeroMetric = styled(AutoFitHeroValue)`
	margin: auto 0;
`;
const HotTubTemp = styled.div`
	display: flex;
	align-items: center;
	gap: var(--space-sm);
	font-size: clamp(2.6rem, 10vw, 4rem);
	font-weight: 900;
	line-height: 1;
	letter-spacing: -0.05em;
`;

const Dashboard = () => {
	useSubscribe();
	const showHotTub = isHotTubEnabled();

	const outdoorTemp = useHassState('sensor.outdoor_temp');
	const indoorTemp = useHassState('sensor.main_floor_temp');
	const outdoorHumidity = useHassState('sensor.outdoor_humidity');
	const indoorHumidity = useHassState('sensor.indoor_humidity');

	const hotTubTemp = useHassState('sensor.hot_tub_temp');

	return (
		<Main $showHotTub={showHotTub}>
			<Outdoors>
				<PanelInner>
					<ClimateHeader>
						<ClimateMeta>
							<PanelTitle id="outdoor-climate-heading">
								Outdoor Climate
							</PanelTitle>
						</ClimateMeta>
						<HumidityBadge>
							<HumidityIcon icon={faDroplet} />
							{outdoorHumidity}%
						</HumidityBadge>
					</ClimateHeader>
					<HeroMetric maxFontSize={320} minFontSize={96}>
						{outdoorTemp}°
					</HeroMetric>
				</PanelInner>
			</Outdoors>
			<IndoorPanel>
				<PanelInner>
					<ClimateHeader>
						<ClimateMeta>
							<PanelTitle id="indoor-climate-heading">
								Main Floor Climate
							</PanelTitle>
						</ClimateMeta>
						<HumidityBadge>
							<HumidityIcon icon={faDroplet} />
							{indoorHumidity}%
						</HumidityBadge>
					</ClimateHeader>
					<HeroMetric maxFontSize={272} minFontSize={82}>
						{indoorTemp}°
					</HeroMetric>
				</PanelInner>
			</IndoorPanel>
			{showHotTub && (
				<HotTub>
					<PanelInner>
						<PanelTitle id="hot-tub-heading">Hot tub</PanelTitle>
						<MetricRow>
							<LargerIcon icon={faHotTubPerson} />
							<SubtleText>Feature-flagged temperature card</SubtleText>
						</MetricRow>
						<HotTubTemp>{hotTubTemp}°</HotTubTemp>
					</PanelInner>
				</HotTub>
			)}
			<Levels />
			<Wind />
		</Main>
	);
};

export default Dashboard;
