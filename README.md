# GP Finder

[![Build Status](https://travis-ci.org/nhsuk/gp-finder.svg?branch=master)](https://travis-ci.org/nhsuk/gp-finder)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/gp-finder/badge.svg?branch=master)](https://coveralls.io/github/nhsuk/gp-finder?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/nhsuk/gp-finder/badge.svg)](https://snyk.io/test/github/nhsuk/gp-finder)

A GP surgery finder application to allow the user to easily navigate to a GP
surgery's online booking system.

## Environment variables

Environment variables are expected to be managed by the environment in which
the application is being run. This is best practice as described by
[twelve-factor](https://12factor.net/config).

| Variable                         | Description                                                        | Default               |
|:---------------------------------|:-------------------------------------------------------------------|:----------------------|
| `NODE_ENV`                       | Node environment                                                   | development           |
| `LOG_LEVEL`                      | Numeric [log level](https://github.com/trentm/node-bunyan#levels)  | Depends on `NODE_ENV` |
| `PORT`                           | Port web server is accessible on                                   | 3000                  |
| `ES_HOST`                        | Elasticsearch host name                                            | es                    |
| `ES_PORT`                        | Elasticsearch port                                                 | 9200                  |
| `GOOGLE_ANALYTICS_TRACKING_ID`   | [Google Analytics](https://www.google.co.uk/analytics) property id |                       |
| `WEBTRENDS_ANALYTICS_TRACKING_ID`| [Webtrends](https://www.webtrends.com/) tracking id                |                       |
| `HOTJAR_ANALYTICS_TRACKING_ID`   | [Hotjar](https://www.hotjar.com/) tracking id                      |                       |

## Application development

The application has some scripts to make things easier for development. For
more information about scrips, please read the info [here](scripts/README.md).

Please run the [`./scripts/bootstrap`](scripts/bootstrap) script first and
follow the instructions.

For application specific development, start by cloning the repo and all
submodules i.e. `git clone https://github.com/nhsuk/gp-finder.git && cd
gp-finder/ && git submodule update --init --recursive`

You can run the application using [`./scripts/start`](scripts/start).
The application will be available locally on `http://localhost:3000`.

You can run the tests using [`./scripts/test`](scripts/test).
