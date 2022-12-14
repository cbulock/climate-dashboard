import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { EntitiesProvider } from './context/Entities';

import GlobalStyle from './GlobalStyle';
import Dashboard from './Dashboard';
import Toasts from './components/Toasts';
import ErrorBoundary from './ErrorBoundary';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<StrictMode>
		<ErrorBoundary>
			<GlobalStyle />
			<EntitiesProvider>
				<Toasts />
				<Dashboard />
			</EntitiesProvider>
		</ErrorBoundary>
	</StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
