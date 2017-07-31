# Performance Testing

There are a number of [JMeter](http://jmeter.apache.org/) performance tests.
Each test can be customised with the following parameters:

| Parameter    | Description                                           | Default                     |
| :----------- | :---------------------------------------------------- | :-------------------------- |
| `hostname`   | URL of server to test                                 | staging.beta.nhschoices.net |
| `protocol`   | Protocol required for request                         | https                       |
| `port`       | Port required for request                             | 443                         |
| `users`      | Simulated number of concurrent users                  | 5                           |
| `rampup`     | Time in seconds to ramp up to total number of users   | 20                          |
| `duration`   | Time in seconds to run test                           | 120                         |
| `throughput` | target throughput in samples per minute               | 120                         |
| `csvfile`    | CSV data file containing words to use for name search | gpname.csv                  |

## Tests

* `gp-finder.jmx` visits the search page and proceeds to execute a search with
  a term retrieved from the supplied CSV data file
* `gp-finder-search-only.jmx` executes a search with a term retrieved from the supplied
  CSV data file

## Running Tests

The test can be loaded into JMeter and run from the GUI. However, this is only
recommended during test development and debugging. All other times the test
should be run via the JMeter CLI.

On a machine where the JMeter CLI is available run the following command (from
the project root directory) to start a test execution using the default values.
This will create a log file in the project root directory called
`gp-finder.jtl`:

`jmeter -n -t ./test/performance/gp-finder.jmx -l gp-finder.jtl`

In order to override any of the configurable parameters they need to be
supplied to the CLI in the following manner. The example below overrides all of
the available parameters.
Note: only parameters wishing to be overridden need to be supplied.

`jmeter -n -t ./<path-to-test>/<test-name>.jmx
-Jhostname=localhost -Jprotocol=http -Jport=3000 -Jusers=10 -Jrampup=10
-Jduration=500 -Jthroughput=60 Jcsvfile=search-terms.csv -l gp-finder.jtl`
