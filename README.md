# GP Finder

[![Greenkeeper badge](https://badges.greenkeeper.io/nhsuk/gp-finder.svg)](https://greenkeeper.io/)

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
more information about scripts, please read the info [here](scripts/README.md).

Please run the [`./scripts/bootstrap`](scripts/bootstrap) script first and
follow the instructions.

For application specific development, start by cloning the repo and all
submodules i.e. `git clone https://github.com/nhsuk/gp-finder.git && cd
gp-finder/ && git submodule update --init --recursive`

You can run the application using [`./scripts/start`](scripts/start).
The application will be available locally on `http://localhost:3000` and any changes you make
will be reflected in the app.
You can run the tests using [`./scripts/test`](scripts/test).

## Continuous development

First time run - please run `yarn install` locally as we are using [Husky](https://www.npmjs.com/package/husky])
to manage our git hooks that will ensure a baseline code quality.

You can run the tests continuously using [`./scripts/test`](scripts/test), and once you are happy with the changes you 
have made and want to commit and push your changes, some git hooks will run as spot checks for linting, unit tests and 
security vulnerabilities and coverage.
For this to work seamlessly you need to `yarn install` when you first clone the app as well as 

There's an .env_sample with the ENV variables needed to fill in for development. 

To use that, copy the file and fill in the info. We use [Coveralls](https://coveralls.io) and [Snyk](https://snyk.io/) 
that you can sign up to using your GH account.

`cp .env_sample .env`


## Architecture Decision Records

This repo uses
[Architecture Decision Records](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions)
to record architectural decisions for this project.
They are stored in [doc/architecture/decisions](doc/architecture/decisions).

