import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0% {
    box-shadow: 0 0 100px 60px, inset 0 0 10px 3px;
  }
  50% {
    box-shadow: 0 0 20px 15px, inset 0 0 5px 1px;
  }
  100% {
    box-shadow: 0 0 100px 60px, inset 0 0 10px 3px;
  }
`;

const SToast = styled.div`
	z-index: 100;
	background: white;
	padding: 16px;
	border-radius: 8px;
	font-size: 1.3rem;
	color: ${({ $color }) => $color};
	animation: ${glow} 2s ease-in-out infinite;
	transition: 2000ms opacity ease-in-out;
`;

const Description = styled.div`
	font-weight: 800;
	color: #181818;
`;

// eslint-disable-next-line react/prop-types
const Toast = ({ toast }) => {
	// eslint-disable-next-line camelcase
	const { description, rgb_color } = toast || {};

	return (
		<SToast
			// eslint-disable-next-line camelcase
			$color={`rgb(${rgb_color[0]}, ${rgb_color[1]}, ${rgb_color[2]})`}
		>
			<Description>{description}</Description>
		</SToast>
	);
};

export default Toast;
