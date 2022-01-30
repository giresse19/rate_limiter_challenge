FROM node:alpine
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
ENV PORT 8000
ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}
EXPOSE ${PORT}

CMD [ "npm","run", "start" ]
