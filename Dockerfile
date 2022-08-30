FROM node:14.17-alpine AS build1
ARG ENVIRONMENT_NAME
ENV ENVIRONMENT_NAME $ENVIRONMENT_NAME
RUN mkdir -p /app-build
ADD . /app-build
WORKDIR /app-build
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn --frozen-lockfile
RUN yarn
RUN yarn build:dev

FROM node:14.17-alpine
ARG ENVIRONMENT_NAME
ENV ENVIRONMENT_NAME $ENVIRONMENT_NAME
RUN apk add yarn
ADD package.json /
ADD . /
COPY --from=build1 /app-build/dist ./dist

CMD ["yarn", "start"]
EXPOSE 9000