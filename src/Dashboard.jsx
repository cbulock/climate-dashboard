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
	HeroValue,
	MetricRow,
	Panel,
	PanelInner,
	PanelTitle,
	SubtleText,
} from './components/ui/PanelPrimitives';

const HumidityIcon = styled(FontAwesomeIcon)`
	font-size: 0.95rem;
	color: var(--accent-cyan);
`;

const LargerIcon = styled(FontAwesomeIcon)`
	font-size: 1.15rem;
	color: var(--accent-amber);
`;

const Main = styled.main`
	display: grid;
	grid-template-columns: repeat(12, minmax(0, 1fr));
	grid-template-areas: ${({ $showHotTub }) =>
		$showHotTub
			? "'Outdoors Outdoors Outdoors Outdoors Outdoors Outdoors Wind Wind Wind Wind Wind Wind' 'Indoors Indoors Indoors Indoors Indoors Indoors Wind Wind Wind Wind Wind Wind' 'Levels Levels Levels Levels Levels Levels HotTub HotTub HotTub HotTub HotTub HotTub'"
			: "'Outdoors Outdoors Outdoors Outdoors Outdoors Outdoors Wind Wind Wind Wind Wind Wind' 'Indoors Indoors Indoors Indoors Indoors Indoors Wind Wind Wind Wind Wind Wind' 'Levels Levels Levels Levels Levels Levels Levels Levels Levels Levels Levels Levels'"};
	gap: var(--space-lg);
	width: min(100%, 90rem);
	min-height: 100dvh;
	margin: 0 auto;
	padding: clamp(1rem, 2vw, 2rem);

	@media (min-width: 900px) and (max-width: 1400px) and (min-aspect-ratio: 4/3) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		grid-template-areas: ${({ $showHotTub }) =>
			$showHotTub
				? "'Outdoors Outdoors Wind' 'Indoors Indoors Wind' 'Levels Levels HotTub'"
				: "'Outdoors Outdoors Wind' 'Indoors Indoors Wind' 'Levels Levels Levels'"};
		grid-template-rows: repeat(2, minmax(0, 1fr)) auto;
		gap: var(--space-md);
		padding: 0.85rem;
	}

	@media (max-width: 1000px) {
		grid-template-areas: ${({ $showHotTub }) =>
			$showHotTub
				? "'Outdoors' 'Indoors' 'Wind' 'Levels' 'HotTub'"
				: "'Outdoors' 'Indoors' 'Wind' 'Levels'"};
		grid-template-columns: minmax(0, 1fr);
	}

	@media (max-width: 700px) and (min-height: 900px) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-areas: ${({ $showHotTub }) =>
			$showHotTub
				? "'Outdoors Outdoors' 'Indoors Indoors' 'Levels Wind' 'HotTub HotTub'"
				: "'Outdoors Outdoors' 'Indoors Indoors' 'Levels Wind'"};
		grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) minmax(16rem, auto);
		gap: 0.7rem;
		height: 100dvh;
		padding: 0.7rem;
		overflow: hidden;
	}
`;

const ClimatePanel = styled(Panel)`
	min-height: clamp(13rem, 28vh, 18rem);

	@media (min-width: 900px) and (max-width: 1400px) and (min-aspect-ratio: 4/3) {
		min-height: 0;
	}

	@media (max-width: 700px) and (min-height: 900px) {
		min-height: 0;
	}
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
	min-height: 14rem;

	@media (min-width: 900px) and (max-width: 1400px) and (min-aspect-ratio: 4/3) {
		min-height: 0;
	}

	@media (max-width: 700px) and (min-height: 900px) {
		min-height: 0;
	}
`;
const ClimateHeader = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: var(--space-lg);

	@media (max-width: 700px) and (min-height: 900px) {
		gap: 0.6rem;
	}
`;
const ClimateMeta = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
`;
const HeroMetric = styled(HeroValue)`
	margin-top: auto;

	@media (min-width: 900px) and (max-width: 1400px) and (min-aspect-ratio: 4/3) {
		font-size: ${({ $size = 'hero' }) =>
			$size === 'compact'
				? 'clamp(3rem, 8vw, 4.5rem)'
				: 'clamp(4rem, 10vw, 6.5rem)'};
	}

	@media (max-width: 700px) and (min-height: 900px) {
		margin: auto 0;
		font-size: ${({ $size = 'hero' }) =>
			$size === 'compact'
				? 'clamp(6.3rem, 24vw, 8.2rem)'
				: 'clamp(7.4rem, 29vw, 10rem)'};
		line-height: 0.78;
	}
`;
const HotTubTemp = styled.div`
	display: flex;
	align-items: center;
	gap: var(--space-sm);
	font-size: clamp(3rem, 7vw, 5rem);
	font-weight: 900;
	line-height: 1;
	letter-spacing: -0.05em;

	@media (max-width: 700px) and (min-height: 900px) {
		font-size: clamp(2.6rem, 10vw, 4rem);
	}
`;

const Dashboard = () => {
	useSubscribe();
	const showHotTub = isHotTubEnabled();

	const outdoorTemp = useHassState('sensor.outdoor_temp');
	const indoorTemp = useHassState('sensor.indoor_temp');
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
								Outdoor climate
							</PanelTitle>
						</ClimateMeta>
						<AccentBadge>
							<HumidityIcon icon={faDroplet} />
							{outdoorHumidity}%
						</AccentBadge>
					</ClimateHeader>
					<HeroMetric>{outdoorTemp}°</HeroMetric>
				</PanelInner>
			</Outdoors>
			<IndoorPanel>
				<PanelInner>
					<ClimateHeader>
						<ClimateMeta>
							<PanelTitle id="indoor-climate-heading">
								Indoor climate
							</PanelTitle>
						</ClimateMeta>
						<AccentBadge>
							<HumidityIcon icon={faDroplet} />
							{indoorHumidity}%
						</AccentBadge>
					</ClimateHeader>
					<HeroMetric $size="compact">{indoorTemp}°</HeroMetric>
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
