import styled, { css } from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet, faHotTubPerson } from '@fortawesome/free-solid-svg-icons';

import useSubscribe from './hooks/useSubscribe';
import useHassState from './hooks/useHassState';
import useHassHistory from './hooks/useHassHistory';
import { isHotTubEnabled } from './lib/env';
import { smoothHistoryPoints } from './lib/history';

import Levels from './components/Levels';
import SecondaryMetrics from './components/SecondaryMetrics';
import Wind from './components/Wind';
import Sparkline from './components/ui/Sparkline';
import {
	AccentBadge,
	AutoFitHeroValue,
	MetricRow,
	Panel,
	PanelInner,
	PanelTitle,
	SubtleText,
} from './components/ui/PanelPrimitives';

const HISTORY_ENTITY_IDS = [
	'sensor.pond_temp',
	'sensor.uv_index',
	'sensor.outdoor_temp',
	'sensor.main_floor_temp',
	'sensor.wind_avg',
];
const TEMPERATURE_SMOOTHING_WINDOW = 15;
const heatWarningGlow = css`
	border-color: rgba(248, 113, 113, 0.72);
	box-shadow:
		inset 0 0 34px rgba(248, 113, 113, 0.12),
		0 0 14px rgba(248, 113, 113, 0.3);
`;

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
			? "'Outdoors Outdoors' 'Indoors Indoors' 'Levels Wind' 'HotTub HotTub' 'Secondary Secondary'"
			: "'Outdoors Outdoors' 'Indoors Indoors' 'Levels Wind' 'Secondary Secondary'"};
	grid-template-rows: ${({ $showHotTub }) =>
		$showHotTub
			? 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 1fr) minmax(7rem, 0.55fr)'
			: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr) minmax(7rem, 0.55fr)'};
	gap: 0.7rem;
	width: 100%;
	min-height: 100dvh;
	margin: 0 auto;
	padding: 0.7rem;
	overflow: hidden;
`;

const ClimatePanel = styled(Panel)`
	min-height: 0;
	${({ $isHeatWarning }) => $isHeatWarning && heatWarningGlow}
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
	position: relative;
	z-index: 1;
	margin: auto 0;
`;
const TrendFrame = styled.div`
	position: relative;
	display: flex;
	flex: 1;
	min-height: 0;
	overflow: visible;
`;
const ClimateSparkline = styled(Sparkline)`
	z-index: 0;
	inset: 0 auto 0 -1rem;
	width: calc(100% + 2rem + 2px);
	height: 100%;
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
	const history = useHassHistory(HISTORY_ENTITY_IDS);
	const outdoorHistory = smoothHistoryPoints(
		history['sensor.outdoor_temp'],
		TEMPERATURE_SMOOTHING_WINDOW,
	);
	const indoorHistory = smoothHistoryPoints(
		history['sensor.main_floor_temp'],
		TEMPERATURE_SMOOTHING_WINDOW,
	);

	const outdoorTemp = useHassState('sensor.outdoor_temp');
	const outdoorTempRaw = useHassState('sensor.outdoor_temp', false);
	const indoorTemp = useHassState('sensor.main_floor_temp');
	const indoorTempRaw = useHassState('sensor.main_floor_temp', false);
	const outdoorHumidity = useHassState('sensor.outdoor_humidity');
	const indoorHumidity = useHassState('sensor.main_floor_humidity');

	const hotTubTemp = useHassState('sensor.hot_tub_temp');

	return (
		<Main $showHotTub={showHotTub}>
			<Outdoors
				$isHeatWarning={outdoorTempRaw > 100}
				data-heat-warning={outdoorTempRaw > 100 ? 'true' : 'false'}
			>
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
					<TrendFrame>
						<ClimateSparkline
							points={outdoorHistory}
							color="var(--accent-cyan)"
							opacity={0.24}
						/>
						<HeroMetric maxFontSize={320} minFontSize={96}>
							{outdoorTemp}°
						</HeroMetric>
					</TrendFrame>
				</PanelInner>
			</Outdoors>
			<IndoorPanel
				$isHeatWarning={indoorTempRaw > 80}
				data-heat-warning={indoorTempRaw > 80 ? 'true' : 'false'}
			>
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
					<TrendFrame>
						<ClimateSparkline
							points={indoorHistory}
							color="var(--accent-amber)"
							opacity={0.22}
						/>
						<HeroMetric maxFontSize={272} minFontSize={82}>
							{indoorTemp}°
						</HeroMetric>
					</TrendFrame>
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
			<Wind history={history['sensor.wind_avg']} />
			<SecondaryMetrics history={history} />
		</Main>
	);
};

export default Dashboard;
