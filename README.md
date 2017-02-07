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

Start off by cloning the repo and all submodules i.e. `git clone https://github.com/nhsuk/profiles.git && git submodule update --init --recursive`

In order to get the application running locally (with Docker) use the information available in https://github.com/nhsuk/nhsuk-rancher-templates. Specifically in `profiles_local_dev`, available from https://github.com/nhsuk/nhsuk-rancher-templates/tree/master/templates

