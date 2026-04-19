# climate-dashboard

A lightweight React dashboard for Home Assistant climate and alert data.

## Environment variables

Set these before starting the app or building it:

- `VITE_HASS_URL` - Home Assistant base URL
- `VITE_HASS_TOKEN` - Home Assistant long-lived access token

For migration compatibility, Vite is also configured to accept the older `REACT_APP_HASS_URL` and `REACT_APP_HASS_TOKEN` names.

For Docker builds, make the variables available in your shell before running `npm run docker-build`, or pass them explicitly with `docker build --build-arg ...`.

## Scripts

- `npm start` or `npm run dev` - start the Vite dev server
- `npm run build` - create the production bundle in `build/`
- `npm run preview` - preview the production bundle locally
- `npm run lint` - run ESLint across the app source
- `npm run docker-build` - build the Nginx image using `VITE_HASS_URL` and `VITE_HASS_TOKEN` from your shell environment
- `npm test` - run the Vitest suite once
- `npm run test:watch` - run tests in watch mode

Run a single test file with:

```bash
npm test -- src/components/Dashboard.test.jsx
```

## Architecture

- `src/App.jsx` composes the app shell, global styles, error boundary, entity provider, toast layer, and dashboard.
- `src/hooks/useSubscribe.jsx` owns the Home Assistant websocket subscription and populates `EntitiesContext` with the latest entity map.
- `src/hooks/useHassState.jsx` and `src/hooks/useToasts.jsx` are the main read APIs used by the UI.
- `src/Dashboard.jsx`, `src/components/Levels.jsx`, `src/components/Wind.jsx`, and `src/components/Toasts.jsx` render the display using hard-coded Home Assistant entity IDs.

## Deployment

`npm run build` writes the static bundle to `build/`, and the Docker image serves that directory from Nginx using `buildconfig/nginx.conf`.
