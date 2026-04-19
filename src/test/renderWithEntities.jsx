import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { EntitiesContext } from '../context/Entities';

const renderWithEntities = (ui, { entities = {} } = {}) =>
	render(
		<EntitiesContext.Provider value={{ entities, setEntities: vi.fn() }}>
			{ui}
		</EntitiesContext.Provider>,
	);

export default renderWithEntities;
