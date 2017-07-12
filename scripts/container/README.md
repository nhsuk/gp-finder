# Container Scripts

The scripts in these folder are meant to be called from docker compose files and are run within containers.

[`ci-tests`](ci-tests) This script is run by docker compose within a container hosted in CI. Runs linter, tests and code coverage stats generation within the container.

[`test-watch`](test-watch) Script to be run by docker compose within a container hosted locally. Runs tests within the container and watches for file changes.
