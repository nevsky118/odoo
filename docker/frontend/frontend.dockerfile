FROM node:lts AS build
WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm install --verbose

COPY ./frontend .
RUN npm run build

FROM nginx:alpine AS runtime
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]