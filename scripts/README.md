# Scripts

See [https://github.com/github/scripts-to-rule-them-all](https://github.com/github/scripts-to-rule-them-all)
for additional background on these scripts.

Below is a list of scripts available, along with a simple description of
what each one does. The details of what they are doing is available within the
script.

[`bootstrap`](bootstrap)
Installs project's direct dependencies e.g. npm packages.

[`deploy`](deploy)
Clone [ci-deployment](https://github.com/nhsuk/ci-deployment.git) repo and
execute `deploy` script.

[`start`](start)
Starts the application within a container, available on [localhost:3000](http://localhost:3000).
The application will restart on file changes.

[`test`](test)
Runs the application's tests within the container.

[`test-ci`](test-ci)
Runs the tests within the container, used for CI. Lint is run and code coverage is generated and checked.
