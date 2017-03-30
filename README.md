# GP Finder

[![Build Status](https://travis-ci.org/nhsuk/gp-finder.svg?branch=master)](https://travis-ci.org/nhsuk/gp-finder)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/gp-finder/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/gp-finder?branch=master)

A GP surgery finder application to allow the user to easily navigate to a GP surgeries online booking system.

## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

| Variable                         | Description                                                        | Default      | Required        |
|:---------------------------------|:-------------------------------------------------------------------|:-------------|-----------------|
| `NODE_ENV`                       | node environment                                                   | development  |                 |
| `PORT`                           | server port                                                        | 3000         |                 |
| `GOOGLE_ANALYTICS_TRACKING_ID`   | [Google Analytics](https://www.google.co.uk/analytics) property id |              |                 |
| `WEBTRENDS_ANALYTICS_TRACKING_ID`| [Webtrends](https://www.webtrends.com/) tracking id                |              |                 |
| `HOTJAR_ANALYTICS_TRACKING_ID`   | [Hotjar](https://www.hotjar.com/) tracking id                      |              |                 |

## Application development

Start by cloning the repo and all submodules i.e. `git clone https://github.com/nhsuk/gp-finder.git && cd gp-finder/ && git submodule update --init --recursive`

Run the application with Docker via `docker-compose up --build --force-recreate`. This will build an image based on the code in the current working directory and start it running. It will most likely be available locally on http://localhost:3000 as long as the port exposed in `docker-compose.yml` is `3000`.

When finished with the application `docker-compose down -v` should be run to shutdown all services including volumes. This is the correct way to close down resource used by the `up` command.

It is good practice to run the tests in a Docker container. To do this run `docker-compose -p gp-finder-test -f docker-compose-tests.yml up --build --force-recreate tests`. A new container will be started where the tests will run and rerun when changes are made to the source code.
When finished with the tests run `docker-compose -p gp-finder-test -f docker-compose-tests.yml down -v` to tidy up.
