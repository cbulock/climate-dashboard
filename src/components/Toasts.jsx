import styled from 'styled-components';

import useToasts from '../hooks/useToasts';

import Toast from './Toast';

const SToasts = styled.div`
	position: absolute;
	width: 100%;
	bottom: 12px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 48px;
`;

const Toasts = () => {
	const toasts = useToasts();

	if (!Array.isArray(toasts)) return null;

	return (
		<SToasts>
			{toasts.map((toast) => (
				<Toast key={toast.name} toast={toast} />
			))}
		</SToasts>
	);
};

export default Toasts;
