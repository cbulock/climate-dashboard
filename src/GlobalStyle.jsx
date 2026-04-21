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
		background: var(--bg-base);
	}

	body {
		position: relative;
		isolation: isolate;
		margin: 0;
		min-height: 100dvh;
		font-family: var(--sans-serif-font);
		background:
			linear-gradient(180deg, rgba(15, 27, 46, 0.28), rgba(7, 17, 31, 0.08)),
			var(--bg-base);
		color: var(--text-primary);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		overflow-x: hidden;
	}

	body::before {
		content: '';
		position: fixed;
		inset: -22%;
		z-index: -2;
		pointer-events: none;
		background:
			radial-gradient(ellipse 56% 46% at center, rgba(34, 211, 238, 0.22), transparent 72%),
			radial-gradient(ellipse 48% 40% at center, rgba(251, 191, 36, 0.2), transparent 72%),
			radial-gradient(ellipse 52% 42% at center, rgba(56, 189, 248, 0.11), transparent 74%),
			radial-gradient(ellipse 44% 36% at center, rgba(249, 115, 22, 0.14), transparent 72%),
			radial-gradient(circle at center, rgba(7, 17, 31, 0), rgba(7, 17, 31, 0.18) 72%);
		background-repeat: no-repeat;
		background-size:
			150% 150%,
			144% 144%,
			148% 148%,
			138% 138%,
			100% 100%;
		filter: blur(34px) saturate(118%);
		transform-origin: center;
		mix-blend-mode: screen;
	}

	body::after {
		content: '';
		position: fixed;
		inset: -26%;
		z-index: -1;
		pointer-events: none;
		background:
			radial-gradient(ellipse 42% 34% at center, rgba(96, 165, 250, 0.14), transparent 72%),
			radial-gradient(ellipse 40% 32% at center, rgba(45, 212, 191, 0.1), transparent 70%),
			radial-gradient(ellipse 34% 28% at center, rgba(251, 146, 60, 0.1), transparent 72%),
			radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0), rgba(15, 23, 42, 0.28) 72%);
		background-repeat: no-repeat;
		background-size:
			132% 132%,
			126% 126%,
			118% 118%,
			100% 100%;
		filter: blur(54px) saturate(122%);
		transform-origin: 50% 50%;
		mix-blend-mode: soft-light;
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
