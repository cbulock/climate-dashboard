import styled from 'styled-components';

export const Panel = styled.section`
	position: relative;
	overflow: hidden;
	border: 1px solid var(--panel-border);
	border-radius: var(--radius-xl);
	background: linear-gradient(
		180deg,
		rgba(255, 255, 255, 0.06),
		rgba(255, 255, 255, 0.03)
	);
	box-shadow: var(--panel-shadow);
	backdrop-filter: blur(20px);
`;

export const PanelInner = styled.div`
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	gap: var(--space-md);
	padding: var(--space-xl);
	height: 100%;

	@media (max-width: 700px) and (min-height: 900px) {
		gap: 0.75rem;
		padding: 1rem;
	}
`;

export const PanelEyebrow = styled.p`
	margin: 0;
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: var(--text-muted);
`;

export const PanelTitle = styled.h2`
	margin: 0;
	font-size: clamp(1rem, 1.2vw, 1.25rem);
	font-weight: 700;
	color: var(--text-primary);

	@media (max-width: 700px) and (min-height: 900px) {
		font-size: 0.95rem;
	}
`;

export const HeroValue = styled.div`
	font-size: ${({ $size = 'hero' }) =>
		$size === 'compact'
			? 'clamp(3.25rem, 10vw, 5rem)'
			: 'clamp(4.75rem, 14vw, 9rem)'};
	font-weight: 900;
	line-height: 0.9;
	letter-spacing: -0.06em;
	color: var(--text-primary);
`;

export const MetricRow = styled.div`
	display: flex;
	align-items: center;
	gap: var(--space-sm);
	flex-wrap: wrap;
	font-size: clamp(1rem, 2.2vw, 1.2rem);
	font-weight: 600;
	color: var(--text-secondary);
`;

export const SubtleText = styled.p`
	margin: 0;
	font-size: 0.95rem;
	color: var(--text-secondary);
`;

export const AccentBadge = styled.span`
	display: inline-flex;
	align-items: center;
	gap: 0.45rem;
	padding: 0.5rem 0.8rem;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.08);

	@media (max-width: 700px) and (min-height: 900px) {
		gap: 0.35rem;
		padding: 0.4rem 0.65rem;
		font-size: 0.88rem;
	}
`;
