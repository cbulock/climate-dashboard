# climate-dashboard

A lightweight React dashboard for Home Assistant climate and alert data, intentionally tuned for a wall-mounted Amazon Fire 7 tablet (7th/9th gen) at a 600x1024 portrait viewport.

## Environment variables

Set these before starting the app or building it:

- `VITE_HASS_URL` - Home Assistant base URL
- `VITE_HASS_TOKEN` - Home Assistant long-lived access token
- `VITE_ENABLE_HOT_TUB` - optional flag to show the hot tub panel (`true`, `1`, `yes`, or `on`). Defaults to hidden.

For local Vite development, these can come from your shell environment.

## Scripts

- `npm start` or `npm run dev` - start the Vite dev server
- `npm run build` - create the production bundle in `build/`
- `npm run preview` - preview the production bundle locally
- `npm run lint` - run ESLint across the app source
- `npm run docker-build` - build the generic Nginx image for GHCR or local container use
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
- The pool panel has been removed from the UI. The hot tub panel remains implemented but is hidden unless `VITE_ENABLE_HOT_TUB` is enabled.

## Deployment

`npm run build` writes the static bundle to `build/`, and the Docker image serves that directory from Nginx using `buildconfig/nginx.conf`.

### GitHub Container Registry

This repo includes `.github/workflows/docker-publish.yml` to build the Docker image in GitHub Actions and publish it to:

`ghcr.io/cbulock/climate-dashboard`

The published image is generic: GitHub does **not** need Home Assistant secrets to build it.

At container startup, Nginx writes `/runtime-config.js` from these runtime environment variables:

- `VITE_HASS_URL`
- `VITE_HASS_TOKEN`
- `VITE_ENABLE_HOT_TUB` (optional)

Example:

```bash
docker run -d -p 8080:80 \
  -e VITE_HASS_URL=https://homeassistant.example.com \
  -e VITE_HASS_TOKEN=your-long-lived-token \
  -e VITE_ENABLE_HOT_TUB=false \
  ghcr.io/cbulock/climate-dashboard:latest
```

On pull requests, the workflow performs a Docker build without pushing the image. On pushes to `main`, tags matching `v*`, or manual dispatch, GitHub publishes the image to GHCR with branch, SHA, tag, and `latest` tags where appropriate.
