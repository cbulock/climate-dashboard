import { useLayoutEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
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
	gap: 0.75rem;
	padding: 1rem;
	height: 100%;
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
	font-size: 0.95rem;
	font-weight: 700;
	color: var(--text-primary);
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

const AutoFitValueFrame = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	height: 100%;
	min-height: 0;
`;

const AutoFitValueText = styled.span`
	display: inline-block;
	white-space: nowrap;
	font-weight: 900;
	line-height: ${({ $lineHeight }) => $lineHeight};
	letter-spacing: -0.06em;
	color: var(--text-primary);
	font-size: ${({ $fontSize }) => `${$fontSize}px`};
`;

export const AutoFitHeroValue = ({
	children,
	className,
	lineHeight = 0.78,
	maxFontSize = 180,
	minFontSize = 48,
}) => {
	const frameRef = useRef(null);
	const textRef = useRef(null);
	const [fontSize, setFontSize] = useState(maxFontSize);

	useLayoutEffect(() => {
		const frame = frameRef.current;
		const text = textRef.current;

		if (!frame || !text) {
			return undefined;
		}

		let animationFrameId;

		const fitText = () => {
			const availableWidth = frame.clientWidth;
			const availableHeight = frame.clientHeight;

			if (!availableWidth || !availableHeight) {
				return;
			}

			let low = minFontSize;
			let high = maxFontSize;
			let best = minFontSize;

			while (low <= high) {
				const mid = Math.floor((low + high) / 2);

				text.style.fontSize = `${mid}px`;

				const fits =
					text.scrollWidth <= availableWidth &&
					text.scrollHeight <= availableHeight;

				if (fits) {
					best = mid;
					low = mid + 1;
				} else {
					high = mid - 1;
				}
			}

			text.style.fontSize = '';
			setFontSize((current) => (current === best ? current : best));
		};

		const scheduleFit = () => {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = requestAnimationFrame(fitText);
		};

		scheduleFit();

		if (typeof ResizeObserver === 'undefined') {
			return () => cancelAnimationFrame(animationFrameId);
		}

		const observer = new ResizeObserver(scheduleFit);
		observer.observe(frame);

		return () => {
			cancelAnimationFrame(animationFrameId);
			observer.disconnect();
		};
	}, [children, maxFontSize, minFontSize]);

	return (
		<AutoFitValueFrame ref={frameRef} className={className}>
			<AutoFitValueText
				ref={textRef}
				$fontSize={fontSize}
				$lineHeight={lineHeight}
			>
				{children}
			</AutoFitValueText>
		</AutoFitValueFrame>
	);
};

AutoFitHeroValue.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	lineHeight: PropTypes.number,
	maxFontSize: PropTypes.number,
	minFontSize: PropTypes.number,
};

AutoFitHeroValue.defaultProps = {
	className: undefined,
	lineHeight: 0.78,
	maxFontSize: 180,
	minFontSize: 48,
};

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
	gap: 0.35rem;
	padding: 0.4rem 0.65rem;
	border-radius: 999px;
	font-size: 0.88rem;
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.08);
`;
