import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Sparkline from './Sparkline';

describe('Sparkline', () => {
	it('does not render without at least two valid points', () => {
		const { container, rerender } = render(<Sparkline />);

		expect(container.querySelector('svg')).not.toBeInTheDocument();

		rerender(<Sparkline points={[{ timestamp: 1, value: 10 }]} />);

		expect(container.querySelector('svg')).not.toBeInTheDocument();
	});

	it('renders flat and changing numeric series with finite coordinates', () => {
		const { container, rerender } = render(
			<Sparkline
				points={[
					{ timestamp: 1, value: 10 },
					{ timestamp: 2, value: 10 },
				]}
			/>,
		);

		expect(container.querySelectorAll('path')[1]).toHaveAttribute(
			'd',
			'M 0,50 L 100,50',
		);

		rerender(
			<Sparkline
				points={[
					{ timestamp: 1, value: 10 },
					{ timestamp: 2, value: 20 },
					{ timestamp: Number.NaN, value: 30 },
				]}
			/>,
		);

		expect(container.querySelectorAll('path')[1].getAttribute('d')).toBe(
			'M 0,90 L 100,10',
		);
	});

	it('uses a smooth line and a filled area for multi-point series', () => {
		const { container } = render(
			<Sparkline
				points={[
					{ timestamp: 1, value: 10 },
					{ timestamp: 2, value: 20 },
					{ timestamp: 3, value: 15 },
				]}
			/>,
		);
		const [area, line] = container.querySelectorAll('path');

		expect(line.getAttribute('d')).toContain(' C ');
		expect(area.getAttribute('fill')).toMatch(/^url\(#sparkline-fill-/);
		expect(area.getAttribute('d')).toMatch(/L 100,110 L 0,110 Z$/);
	});

	it('keeps smoothed paths moving forward with uneven timestamps', () => {
		const { container } = render(
			<Sparkline
				points={[
					{ timestamp: 0, value: 10 },
					{ timestamp: 1, value: 20 },
					{ timestamp: 4, value: 15 },
				]}
			/>,
		);
		const linePath = container.querySelectorAll('path')[1].getAttribute('d');
		const controlPointXs = Array.from(
			linePath.matchAll(/C ([\d.]+),[\d.]+ ([\d.]+),[\d.]+ ([\d.]+),[\d.]+/g),
		)
			.flatMap((match) => match.slice(1))
			.map(Number);

		expect(controlPointXs).toEqual(
			[...controlPointXs].sort((left, right) => left - right),
		);
		expect(linePath).toMatch(/^M 0,90 C /);
		expect(linePath).toMatch(/100,50$/);
		expect(linePath).not.toContain('NaN');
	});
});
