import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
	:root {
		--sans-serif-font: 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
			'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
			'Helvetica Neue', sans-serif;
		--bg-base: #07111f;
		--bg-elevated: #0f1b2e;
		--panel-border: rgba(148, 163, 184, 0.18);
		--panel-shadow: 0 20px 60px rgba(3, 8, 18, 0.45);
		--text-primary: #f8fafc;
		--text-secondary: #cbd5e1;
		--text-muted: #94a3b8;
		--accent-cyan: #22d3ee;
		--accent-amber: #fbbf24;
		--accent-red: #f87171;
		--radius-lg: 1rem;
		--radius-xl: 1.75rem;
		--space-sm: 0.75rem;
		--space-md: 1rem;
		--space-lg: 1.5rem;
		--space-xl: 2rem;
	}

	* {
		box-sizing: border-box;
	}

	html {
		background:
			radial-gradient(circle at top, rgba(34, 211, 238, 0.14), transparent 30%),
			radial-gradient(circle at 85% 20%, rgba(251, 191, 36, 0.12), transparent 20%),
			var(--bg-base);
	}

	body {
		margin: 0;
		min-height: 100dvh;
		font-family: var(--sans-serif-font);
		background: transparent;
		color: var(--text-primary);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	#root {
		min-height: 100dvh;
	}

	code {
		font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
			monospace;
	}
`;

export default GlobalStyle;
