# Performance Testing

The `profiles.jmx` [JMeter](http://jmeter.apache.org/) test will call the Profiles application for a number of different surgeries.
Several parameters are exposed to customise the base test.


| Parameter                         | Description                                                        | Default               |
|:---------------------------------|:-------------------------------------------------------------------|-----------------------|
| `hostname`                       | URL of server to test                                              | staging.beta.nhschoices.net|
| `users`                          | Simulated number of concurrent users                               | 5                  |
| `rampup`                         | Time in seconds to ramp up to total number of users                | 20                 |
| `duration`                       | Time in seconds to run test                                        | 120                |
| `throughput`                     | target throughput in samples per minute                            | 120                |
| `csvfile`                        | csv data file of choices ID to use, either `ids_100.csv`, `ids_1200.csv`, or `ids_all.csv` (9000+), allowing a number of different GP pages to be visited during the test | ids_100.csv         |

## Running the Test

The test may be loaded into the JMeter application, or the file may be run from the command line locally by changing into the `test/performance` folder and entering:

/usr/local/bin/jmeter/jmeter -n -t  ./profiles.jmx -Jhostname=*hostname* -Jusers=*users* -Jrampup=*rampup* -Jduration=*duration* -Jthroughput=*throughput* Jcsvfile=*csvfile* -l profiles.jtl


Where the parameters in italics can be substituted with the desired value, or removed entirely to use the default.

*Note:* The path to JMeter may differ depending on your installation location.
