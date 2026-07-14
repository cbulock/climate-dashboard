import styled from 'styled-components';

import useToasts from '../hooks/useToasts';

import Toast from './Toast';

const SToasts = styled.div`
	position: fixed;
	left: 50%;
	bottom: clamp(1rem, 2vw, 2rem);
	transform: translateX(-50%);
	width: min(28rem, calc(100vw - 2rem));
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 0.85rem;
	z-index: 100;
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
