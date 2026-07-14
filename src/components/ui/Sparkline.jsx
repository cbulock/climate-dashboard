import { useId } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const Svg = styled.svg`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	overflow: visible;
	pointer-events: none;
`;

const normalizePoints = (points = []) => {
	const sortedPoints = points
		.map(({ timestamp, value }) => ({
			timestamp: Number(timestamp),
			value: Number(value),
		}))
		.filter(
			({ timestamp, value }) =>
				Number.isFinite(timestamp) && Number.isFinite(value),
		)
		.sort((left, right) => left.timestamp - right.timestamp);
	const validPoints = Array.from(
		sortedPoints
			.reduce((uniquePoints, point) => {
				uniquePoints.set(point.timestamp, point);
				return uniquePoints;
			}, new Map())
			.values(),
	);

	if (validPoints.length === 0) return [];

	const timestamps = validPoints.map(({ timestamp }) => timestamp);
	const values = validPoints.map(({ value }) => value);
	const minTimestamp = Math.min(...timestamps);
	const maxTimestamp = Math.max(...timestamps);
	const minValue = Math.min(...values);
	const maxValue = Math.max(...values);
	const timestampRange = maxTimestamp - minTimestamp;
	const valueRange = maxValue - minValue;

	return validPoints.map(({ timestamp, value }, index) => ({
		x:
			timestampRange === 0
				? (index / Math.max(validPoints.length - 1, 1)) * 100
				: ((timestamp - minTimestamp) / timestampRange) * 100,
		y: valueRange === 0 ? 50 : 90 - ((value - minValue) / valueRange) * 80,
	}));
};

const createSmoothPath = (points) => {
	if (points.length === 2) {
		return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
	}

	const widths = points
		.slice(0, -1)
		.map((point, index) => points[index + 1].x - point.x);
	const slopes = widths.map(
		(width, index) => (points[index + 1].y - points[index].y) / width,
	);
	const tangents = points.map((point, index) => {
		if (index === 0) return slopes[0];
		if (index === points.length - 1) return slopes[slopes.length - 1];

		const previousSlope = slopes[index - 1];
		const nextSlope = slopes[index];

		if (
			previousSlope === 0 ||
			nextSlope === 0 ||
			Math.sign(previousSlope) !== Math.sign(nextSlope)
		) {
			return 0;
		}

		const previousWidth = widths[index - 1];
		const nextWidth = widths[index];
		const previousWeight = 2 * nextWidth + previousWidth;
		const nextWeight = nextWidth + 2 * previousWidth;

		return (
			(previousWeight + nextWeight) /
			(previousWeight / previousSlope + nextWeight / nextSlope)
		);
	});

	return points.slice(1).reduce((path, next, index) => {
		const point = points[index];
		const width = next.x - point.x;
		const controlOffset = width / 3;

		return `${path} C ${point.x + controlOffset},${
			point.y + (tangents[index] * width) / 3
		} ${next.x - controlOffset},${
			next.y - (tangents[index + 1] * width) / 3
		} ${next.x},${next.y}`;
	}, `M ${points[0].x},${points[0].y}`);
};

const Sparkline = ({
	className,
	color = 'var(--accent-cyan)',
	opacity = 0.22,
	points = [],
}) => {
	const gradientId = `sparkline-fill-${useId().replace(/:/g, '')}`;
	const normalizedPoints = normalizePoints(points);

	if (normalizedPoints.length < 2) return null;

	const linePath = createSmoothPath(normalizedPoints);
	const firstPoint = normalizedPoints[0];
	const lastPoint = normalizedPoints[normalizedPoints.length - 1];
	const areaPath = `${linePath} L ${lastPoint.x},110 L ${firstPoint.x},110 Z`;

	return (
		<Svg
			className={className}
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
			aria-hidden="true"
			focusable="false"
		>
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
					<stop
						offset="0%"
						stopColor={color}
						stopOpacity={Math.min(opacity + 0.04, 0.22)}
					/>
					<stop offset="100%" stopColor={color} stopOpacity="0.02" />
				</linearGradient>
			</defs>
			<path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
			<path
				d={linePath}
				fill="none"
				stroke={color}
				strokeOpacity={opacity}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</Svg>
	);
};

Sparkline.propTypes = {
	className: PropTypes.string,
	color: PropTypes.string,
	opacity: PropTypes.number,
	points: PropTypes.arrayOf(
		PropTypes.shape({
			timestamp: PropTypes.number.isRequired,
			value: PropTypes.number.isRequired,
		}),
	),
};

Sparkline.defaultProps = {
	className: undefined,
	color: undefined,
	opacity: undefined,
	points: undefined,
};

export default Sparkline;
