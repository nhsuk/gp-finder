#!/bin/bash
docker-compose -p gp-finder-test -f docker-compose-tests.yml down -v
docker-compose -p gp-finder-test -f docker-compose-tests.yml up --build --force-recreate tests