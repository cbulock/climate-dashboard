import styled, { keyframes } from 'styled-components';

const glow = keyframes`
	0% {
		transform: translateY(0);
		box-shadow: 0 14px 34px rgba(2, 6, 23, 0.28);
	}
	50% {
		transform: translateY(-2px);
		box-shadow: 0 18px 40px rgba(2, 6, 23, 0.36);
	}
	100% {
		transform: translateY(0);
		box-shadow: 0 14px 34px rgba(2, 6, 23, 0.28);
	}
`;

const SToast = styled.div`
	z-index: 100;
	display: flex;
	align-items: center;
	gap: 0.85rem;
	min-width: min(28rem, 100%);
	padding: 1rem 1.1rem;
	border-radius: 1rem;
	background: rgba(15, 23, 42, 0.88);
	border: 1px solid rgba(255, 255, 255, 0.08);
	font-size: 1rem;
	color: var(--text-primary);
	animation: ${glow} 2s ease-in-out infinite;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

const Accent = styled.div`
	flex: 0 0 0.35rem;
	align-self: stretch;
	border-radius: 999px;
	background: ${({ $color }) => $color};
`;

const Description = styled.div`
	font-weight: 800;
	color: var(--text-primary);
`;

// eslint-disable-next-line react/prop-types
const Toast = ({ toast }) => {
	// eslint-disable-next-line camelcase
	const { description, rgb_color: rgbColor } = toast || {};
	const accentColor =
		Array.isArray(rgbColor) && rgbColor.length === 3
			? `rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`
			: 'var(--accent-amber)';

	return (
		<SToast role="status" aria-live="polite">
			<Accent $color={accentColor} />
			<Description>{description}</Description>
		</SToast>
	);
};

export default Toast;
