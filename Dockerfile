FROM node:14
RUN mkdir -p /app
ADD . /app
WORKDIR /app
RUN yarn
CMD [ "yarn", "start" ]
EXPOSE 9000