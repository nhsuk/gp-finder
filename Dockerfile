FROM node:7.4-alpine
RUN apk add --no-cache git

ENV USERNAME nodeuser

RUN adduser -D $USERNAME && \
    mkdir /code && \
    chown $USERNAME:$USERNAME /code

USER $USERNAME
WORKDIR /code

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY npm-shrinkwrap.json /code
RUN if [ "$NODE_ENV" == "production" ]; then npm install --quiet --only=prod; else npm install --quiet ; fi

EXPOSE 3000

COPY . /code

USER root
RUN chown -R $USERNAME:$USERNAME /code
USER $USERNAME

RUN [ "npm", "run", "build-css" ]

CMD [ "npm", "start" ]
