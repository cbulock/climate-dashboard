import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import styled, { keyframes } from 'styled-components';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { EntitiesProvider } from './context/Entities';

import GlobalStyle from './GlobalStyle';
import Dashboard from './Dashboard';
import ErrorBoundary from './ErrorBoundary';
import reportWebVitals from './reportWebVitals';

const glow = keyframes`
  0% {
    box-shadow: 0 0 50px 30px, inset 0 0 10px 3px;
  }
  50% {
    box-shadow: 0 0 20px 15px, inset 0 0 5px 1px;
  }
  100% {
    box-shadow: 0 0 50px 30px, inset 0 0 10px 3px;
  }
`;

const SToastContainer = styled(ToastContainer)`
	&&&.Toastify__toast-container {
	}
	.Toastify__toast {
		margin-top: 3rem;
		font-family: var(--sans-serif-font);
		animation: ${glow} 2s 1s ease-in-out infinite;
	}
	.Toastify__toast-body {
		div {
			color: #3a3a3a;
			font-weight: 700;
			text-align: center;
		}
	}
	.Toastify__progress-bar {
	}
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<StrictMode>
		<ErrorBoundary>
			<GlobalStyle />
			<SToastContainer
				autoClose={false}
				closeButton={false}
				position="bottom-center"
			/>
			<EntitiesProvider>
				<Dashboard />
			</EntitiesProvider>
		</ErrorBoundary>
	</StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
