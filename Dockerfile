# build stage
#FROM node:16-slim
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN apk update && apk upgrade
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN apk add make g++
RUN npm install -g npm@9.1.2
RUN npm install --legacy-peer-deps
COPY . .
COPY .env .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
USER 1221:1221
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
