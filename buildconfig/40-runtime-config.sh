#!/bin/sh
set -eu

js_escape() {
	printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

cat <<EOF >/usr/share/nginx/html/runtime-config.js
window.__CLIMATE_DASHBOARD_CONFIG__ = {
  VITE_HASS_URL: "$(js_escape "${VITE_HASS_URL:-}")",
  VITE_HASS_TOKEN: "$(js_escape "${VITE_HASS_TOKEN:-}")",
  VITE_ENABLE_HOT_TUB: "$(js_escape "${VITE_ENABLE_HOT_TUB:-}")"
};
EOF
