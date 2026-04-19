import GlobalStyle from './GlobalStyle';
import Dashboard from './Dashboard';
import Toasts from './components/Toasts';
import { EntitiesProvider } from './context/Entities';
import ErrorBoundary from './ErrorBoundary';

const App = () => (
	<ErrorBoundary>
		<GlobalStyle />
		<EntitiesProvider>
			<Toasts />
			<Dashboard />
		</EntitiesProvider>
	</ErrorBoundary>
);

export default App;
