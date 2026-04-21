import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
	@keyframes lavaBlobTravelA {
		0% {
			background-position:
				-6% 10%,
				108% 12%,
				52% 110%,
				32% 52%,
				50% 50%;
		}

		14% {
			background-position:
				18% -8%,
				90% 26%,
				40% 82%,
				86% 24%,
				50% 50%;
		}

		29% {
			background-position:
				44% 10%,
				70% 50%,
				18% 64%,
				104% 74%,
				50% 50%;
		}

		47% {
			background-position:
				8% 44%,
				106% 72%,
				72% 34%,
				84% 112%,
				50% 50%;
		}

		63% {
			background-position:
				-10% 78%,
				90% 104%,
				90% 14%,
				22% 118%,
				50% 50%;
		}

		81% {
			background-position:
				28% 110%,
				64% 88%,
				112% -2%,
				-6% 86%,
				50% 50%;
		}

		100% {
			background-position:
				-6% 10%,
				108% 12%,
				52% 110%,
				32% 52%,
				50% 50%;
		}
	}

	@keyframes lavaBlobTravelB {
		0% {
			background-position:
				102% 18%,
				-6% 88%,
				50% 8%,
				50% 50%;
		}

		18% {
			background-position:
				72% -6%,
				18% 58%,
				98% 40%,
				50% 50%;
		}

		37% {
			background-position:
				112% 48%,
				44% 12%,
				68% 94%,
				50% 50%;
		}

		58% {
			background-position:
				82% 108%,
				58% -6%,
				8% 70%,
				50% 50%;
		}

		79% {
			background-position:
				42% 98%,
				10% 104%,
				-10% 24%,
				50% 50%;
		}

		100% {
			background-position:
				102% 18%,
				-6% 88%,
				50% 8%,
				50% 50%;
		}
	}

	@keyframes lavaBlobDriftA {
		0% {
			transform: translate3d(-4%, -3%, 0) scale(1.04) rotate(-1.5deg);
			opacity: 0.72;
		}

		21% {
			transform: translate3d(2%, -1%, 0) scale(1.09) rotate(1deg);
			opacity: 0.84;
		}

		44% {
			transform: translate3d(4%, 3%, 0) scale(1.12) rotate(2deg);
			opacity: 0.92;
		}

		67% {
			transform: translate3d(-1%, 4%, 0) scale(1.08) rotate(-0.5deg);
			opacity: 0.8;
		}

		100% {
			transform: translate3d(-4%, -3%, 0) scale(1.04) rotate(-1.5deg);
			opacity: 0.72;
		}
	}

	@keyframes lavaBlobDriftB {
		0% {
			transform: translate3d(3%, 4%, 0) scale(1) rotate(0deg);
			opacity: 0.24;
		}

		26% {
			transform: translate3d(-3%, 0, 0) scale(1.08) rotate(7deg);
			opacity: 0.38;
		}

		49% {
			transform: translate3d(0, -3%, 0) scale(1.04) rotate(-6deg);
			opacity: 0.32;
		}

		74% {
			transform: translate3d(-4%, 3%, 0) scale(1.1) rotate(4deg);
			opacity: 0.4;
		}

		100% {
			transform: translate3d(3%, 4%, 0) scale(1) rotate(0deg);
			opacity: 0.24;
		}
	}

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
		animation:
			lavaBlobTravelA 56s linear infinite,
			lavaBlobDriftA 37s ease-in-out infinite;
		will-change: transform, opacity, background-position;
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
		animation:
			lavaBlobTravelB 71s linear infinite,
			lavaBlobDriftB 49s ease-in-out infinite;
		will-change: transform, opacity, background-position;
	}

	#root {
		min-height: 100dvh;
	}

	@media (prefers-reduced-motion: reduce) {
		body::before,
		body::after {
			animation: none;
		}
	}

	code {
		font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
			monospace;
	}
`;

export default GlobalStyle;
