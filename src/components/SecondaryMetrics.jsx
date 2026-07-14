import PropTypes from 'prop-types';
import styled from 'styled-components';

import useHassState from '../hooks/useHassState';
import getUvRisk from '../lib/uv';
import { Panel, PanelInner } from './ui/PanelPrimitives';
import Sparkline from './ui/Sparkline';

const UV_WARNING_STYLES = {
	high: {
		border: 'rgba(251, 191, 36, 0.55)',
		background: 'rgba(251, 191, 36, 0.14)',
		color: 'var(--accent-amber)',
	},
	'very-high': {
		border: 'rgba(248, 113, 113, 0.55)',
		background: 'rgba(248, 113, 113, 0.14)',
		color: 'var(--accent-red)',
	},
	extreme: {
		border: 'rgba(192, 132, 252, 0.55)',
		background: 'rgba(192, 132, 252, 0.16)',
		color: '#d8b4fe',
	},
};

const UV_CARD_GLOW_STYLES = {
	'very-high': {
		border: 'rgba(248, 113, 113, 0.72)',
		shadow:
			'inset 0 0 24px rgba(248, 113, 113, 0.12), 0 0 12px rgba(248, 113, 113, 0.28)',
	},
	extreme: {
		border: 'rgba(192, 132, 252, 0.82)',
		shadow:
			'inset 0 0 28px rgba(192, 132, 252, 0.18), 0 0 16px rgba(192, 132, 252, 0.38)',
	},
};

const HEAT_GLOW_STYLE = {
	border: 'rgba(248, 113, 113, 0.72)',
	shadow:
		'inset 0 0 24px rgba(248, 113, 113, 0.12), 0 0 12px rgba(248, 113, 113, 0.28)',
};

const Wrapper = styled(Panel).attrs({
	role: 'region',
	'aria-label': 'Pond and UV',
})`
	grid-area: Secondary;
	min-height: 7rem;
`;

const Inner = styled(PanelInner)`
	padding: 0.75rem;
`;

const MetricGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.7rem;
	height: 100%;
`;

const Metric = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	overflow: hidden;
	min-width: 0;
	padding: 0.7rem 0.85rem;
	border: 1px solid rgba(255, 255, 255, 0.06);
	border-radius: var(--radius-lg);
	background: rgba(255, 255, 255, 0.035);
`;

const UvMetric = styled(Metric)`
	border-color: ${({ $riskLevel }) =>
		UV_CARD_GLOW_STYLES[$riskLevel]?.border || 'rgba(255, 255, 255, 0.06)'};
	box-shadow: ${({ $riskLevel }) =>
		UV_CARD_GLOW_STYLES[$riskLevel]?.shadow || 'none'};
`;

const PondMetric = styled(Metric)`
	border-color: ${({ $isHeatWarning }) =>
		$isHeatWarning ? HEAT_GLOW_STYLE.border : 'rgba(255, 255, 255, 0.06)'};
	box-shadow: ${({ $isHeatWarning }) =>
		$isHeatWarning ? HEAT_GLOW_STYLE.shadow : 'none'};
`;

const MetricContent = styled.div`
	position: relative;
	z-index: 1;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 0.5rem;
	height: 100%;
`;

const Label = styled.h2`
	align-self: flex-start;
	margin: 0;
	font-size: 0.82rem;
	font-weight: 700;
	color: var(--text-secondary);
`;

const LabelGroup = styled.div`
	align-self: flex-start;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 0.35rem;
`;

const UvWarning = styled.span`
	padding: 0.22rem 0.45rem;
	border: 1px solid ${({ $level }) => UV_WARNING_STYLES[$level].border};
	border-radius: 999px;
	background: ${({ $level }) => UV_WARNING_STYLES[$level].background};
	font-size: 0.65rem;
	font-weight: 800;
	line-height: 1;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: ${({ $level }) => UV_WARNING_STYLES[$level].color};
`;

const Value = styled.div`
	align-self: flex-end;
	font-size: clamp(2.15rem, 7vw, 3.35rem);
	font-weight: 900;
	line-height: 0.85;
	letter-spacing: -0.05em;
	color: var(--text-primary);
`;

const PondSparkline = styled(Sparkline)`
	z-index: 0;
`;

const UvSparkline = styled(Sparkline)`
	z-index: 0;
`;

const SecondaryMetrics = ({ history }) => {
	const pondTemp = useHassState('sensor.pond_temp');
	const pondTempRaw = useHassState('sensor.pond_temp', false);
	const uvIndex = useHassState('sensor.uv_index');
	const uvRisk = getUvRisk(uvIndex);

	return (
		<Wrapper>
			<Inner>
				<MetricGrid>
					<PondMetric
						$isHeatWarning={pondTempRaw > 90}
						data-heat-warning={pondTempRaw > 90 ? 'true' : 'false'}
					>
						<PondSparkline
							points={history['sensor.pond_temp']}
							color="var(--accent-cyan)"
							opacity={0.18}
						/>
						<MetricContent>
							<Label>Pond</Label>
							<Value>{pondTemp}°</Value>
						</MetricContent>
					</PondMetric>
					<UvMetric
						$riskLevel={uvRisk?.level}
						data-uv-risk={uvRisk?.level || 'normal'}
					>
						<UvSparkline
							points={history['sensor.uv_index']}
							color="var(--accent-amber)"
							opacity={0.18}
						/>
						<MetricContent>
							<LabelGroup>
								<Label>UV index</Label>
								{uvRisk && (
									<UvWarning $level={uvRisk.level}>{uvRisk.label}</UvWarning>
								)}
							</LabelGroup>
							<Value>{uvIndex}</Value>
						</MetricContent>
					</UvMetric>
				</MetricGrid>
			</Inner>
		</Wrapper>
	);
};

SecondaryMetrics.propTypes = {
	history: PropTypes.objectOf(
		PropTypes.arrayOf(
			PropTypes.shape({
				timestamp: PropTypes.number.isRequired,
				value: PropTypes.number.isRequired,
			}),
		),
	),
};

SecondaryMetrics.defaultProps = {
	history: {},
};

export default SecondaryMetrics;
