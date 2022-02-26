FROM node:14.15.1 AS build-stage

WORKDIR /admin

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest AS prod-stage

COPY nginx.conf /temp/prod.conf

RUN envsubst /frontend < /temp/prod.conf > /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build-stage /admin/dist /usr/share/nginx/html

RUN chown nginx:nginx /usr/share/nginx/html/*

ENTRYPOINT [ "nginx", "-g", "daemon off;"]
