import { render, screen } from '@testing-library/react';
import PropTypes from 'prop-types';
import { describe, expect, it, vi } from 'vitest';

import { EntitiesContext } from '../context/Entities';
import useHassState from './useHassState';

const Probe = ({ entityId }) => {
	const value = useHassState(entityId);

	return <span>{value}</span>;
};

Probe.propTypes = {
	entityId: PropTypes.string.isRequired,
};

const renderProbe = (entities, entityId) =>
	render(
		<EntitiesContext.Provider
			value={{
				entities,
				setEntities: vi.fn(),
				connection: null,
				setConnection: vi.fn(),
			}}
		>
			<Probe entityId={entityId} />
		</EntitiesContext.Provider>,
	);

describe('useHassState', () => {
	it('rounds numeric Home Assistant state values', () => {
		renderProbe({ 'sensor.pool_temp': { state: '82.6' } }, 'sensor.pool_temp');

		expect(screen.getByText('83')).toBeInTheDocument();
	});

	it('returns non-numeric Home Assistant states unchanged', () => {
		renderProbe({ 'switch.pool_pump': { state: 'on' } }, 'switch.pool_pump');

		expect(screen.getByText('on')).toBeInTheDocument();
	});

	it('can return an unrounded numeric state for threshold checks', () => {
		const RawProbe = () => {
			const value = useHassState('sensor.outdoor_temp', false);

			return <span>{value}</span>;
		};

		render(
			<EntitiesContext.Provider
				value={{
					entities: { 'sensor.outdoor_temp': { state: '100.1' } },
					setEntities: vi.fn(),
					connection: null,
					setConnection: vi.fn(),
				}}
			>
				<RawProbe />
			</EntitiesContext.Provider>,
		);

		expect(screen.getByText('100.1')).toBeInTheDocument();
	});
});
