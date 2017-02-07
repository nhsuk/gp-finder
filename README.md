# Profiles

[![Coverage Status](https://coveralls.io/repos/github/nhsuk/profiles/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/profiles?branch=master)

A collection of health service provider profiles. Initially containing GP practices and Pharmacies.


## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

| Variable                         | Description                                                                            | Default                  | Required        |
|:---------------------------------|:---------------------------------------------------------------------------------------|:-------------------------|-----------------|
| `NODE_ENV`                       | node environment                                                                       | development              |                 |
| `PORT`                           | server port                                                                            | 3000                     |                 |
| `SPLUNK_HEC_TOKEN`               | [HTTP Event Collector token](http://dev.splunk.com/view/event-collector/SP-CAAAE7C)    |                          | In `production` |
| `SPLUNK_HEC_ENDPOINT`            | [HTTP Event Collector endpoint](http://dev.splunk.com/view/event-collector/SP-CAAAE7H) |                          | In `production` |
| `LOG_LEVEL`                      | [bunyan log level](https://github.com/trentm/node-bunyan#levels)                       | Depends on `NODE_ENV`    |                 |


## Application development

Start by cloning the repo and all submodules i.e. `git clone https://github.com/nhsuk/profiles.git && git submodule update --init --recursive`

Run the application with Docker via `docker-compose up --build --force-recreate`. This will build an image based on the code in the current working directory and start it running. It will most likely be available locally on http://localhost:3000 as long as the port exposed in `docker-compose.yml` is `3000`.

When finished with the application `docker-compose down -v` should be run to shutdown all services including volumes. This is the correct way to close down resource used by the `up` command.

It is good practice to run the tests in a Docker container. To do this run `docker-compose -f docker-compose-tests.yml up --build --force-recreate`. A new container will be started where the tests will run and rerun when changes are made to the source code.

