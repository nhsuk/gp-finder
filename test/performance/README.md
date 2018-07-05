# Performance Testing

[JMeter](http://jmeter.apache.org/) performance tests.

## Tests

* `gp-finder.jmx` visits the search page and uses either a string or postcode
  to search for GPs or locations, respectively.

## Configurable parameters

| Parameter    | Description                                              | Default                     |
| :----------- | :------------------------------------------------------- | :-------------------------- |
| `hostname`   | URL of server to test                                    | staging.beta.nhschoices.net |
| `protocol`   | Protocol required for request                            | https                       |
| `port`       | Port required for request                                | 443                         |
| `users`      | Simulated number of concurrent users                     | 5                           |
| `rampup`     | Time in seconds to ramp up to total number of users      | 20                          |
| `duration`   | Time in seconds to run test                              | 120                         |
| `throughput` | target throughput in samples per minute                  | 120                         |
| `gpnames`    | CSV file containing words for use in name search         | gpnames.csv                 |
| `postcodes`  | CSV file containing postcodes for use in postcode search | outcodes.csv                |

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
-Jduration=500 -Jthroughput=60 -Jgpnames=search-terms.csv
-Jpostcodes=london-postcodes.csv -l gp-finder.jtl`

## CI pipeline
We used the JMeter plugin for TeamCity to run basic performance tests against our application during the build pipeline.
JMeter plugin for TeamCity can use aggregator metrics for the 
[Performance Metrics Calculations](https://github.com/jtorgan/jmeter_plugin/blob/master/readme.txt#L24). We used the 
`total` metric in combination with tweaking the requests per second as explained above 
to achieve a baseline for our app performance.
