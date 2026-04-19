# Copilot instructions for `climate-dashboard`

## Build, test, and lint commands

- `npm start` or `npm run dev` starts the Vite dev server.
- `npm run build` creates the production bundle used by the Docker/Nginx image.
- `npm run preview` serves the built app locally for a production-like check.
- `npm run lint` runs the repo's ESLint + Prettier checks across `src`.
- `npm test` runs the Vitest suite once.
- `npm run test:watch` runs Vitest in watch mode.
- `npm test -- src/components/Dashboard.test.jsx` runs a single test file.
- `npm run docker-build` builds the production image and expects `VITE_HASS_URL` / `VITE_HASS_TOKEN` to already be present in the shell environment.

## High-level architecture

- The app boots in `src/main.jsx`, which renders `src/App.jsx`. `App` wraps the UI as `ErrorBoundary -> GlobalStyle -> EntitiesProvider -> Toasts + Dashboard`.
- Real-time data comes from Home Assistant over `home-assistant-js-websocket`, not from REST calls. `src/hooks/useSubscribe.jsx` creates a long-lived token connection, subscribes to all entities, and stores the full entity map in `EntitiesContext`.
- Leaf components do not open their own connections. They read from shared context through hooks:
  - `useHassState(entityId)` reads `entities[entityId].state` and rounds numeric values.
  - `useToasts()` reads `entities['switch.alerts']?.attributes?.data` for alert banners.
- `src/Dashboard.jsx` is the composition root for the display. It wires hard-coded Home Assistant entity IDs into the weather layout, optionally shows the hot tub panel based on env config, and delegates secondary panels to `components/Levels.jsx` and `components/Wind.jsx`.
- Production deployment is a static build served by Nginx. Vite is configured to write to `build/` so the existing Docker/Nginx deployment shape still works, and `buildconfig/nginx.conf` uses `try_files ... /index.html` for SPA routing.

## Key conventions

- Keep Home Assistant access centralized. New UI pieces should usually consume `useHassState` or a small hook built on `EntitiesContext` instead of talking to `home-assistant-js-websocket` directly from components.
- Entity IDs are part of the app contract and are hard-coded in components (`sensor.outdoor_temp`, `sensor.wind_avg`, `switch.alerts`, etc.). When changing UI behavior, verify the exact Home Assistant entity name and whether it exposes plain `state` or nested `attributes.data`.
- Runtime config uses Vite env names only: `VITE_HASS_URL`, `VITE_HASS_TOKEN`, and optional `VITE_ENABLE_HOT_TUB`.
- Docker builds inject `VITE_HASS_URL` and `VITE_HASS_TOKEN` as build args, so browser config is still determined at image build time rather than runtime.
- Styling is colocated with each component via `styled-components`; there are no separate CSS files for app components.
- ESLint enforces named components as arrow functions and tab-indented JSX/props (`react/function-component-definition`, `react/jsx-indent`, `react/jsx-indent-props` in `.eslintrc.json`).
- The pool panel is intentionally removed from the UI. The hot tub panel is feature-flagged off by default, so dashboard changes should not assume it is visible.
