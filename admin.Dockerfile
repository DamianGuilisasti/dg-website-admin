FROM node:14.15.1 AS build-stage

RUN mkdir -p /usr/src/admin

WORKDIR /usr/src/admin

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine AS prod-stage

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build-stage /usr/src/admin/dist /usr/share/nginx/html

RUN chown nginx:nginx /usr/share/nginx/html/*

ENTRYPOINT [ "nginx", "-g", "daemon off;"]

