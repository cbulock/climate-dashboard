
# build environment
FROM node:22-alpine AS build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ARG VITE_HASS_URL
ARG VITE_HASS_TOKEN
ENV VITE_HASS_URL=$VITE_HASS_URL
ENV VITE_HASS_TOKEN=$VITE_HASS_TOKEN
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY buildconfig/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
