0.22.0 / TBC
===================
- Update npm dependencies
- Upgrade to `eslint-config-nhsuk@0.14.0` and apply fixes
- Remove snyk

0.21.0 / 2018-01-09
===================
- Update npm dependencies

0.20.1 / 2017-11-28
===================
- Update rewire and express
- Fix Webtrends 'undefined' bug

0.20.0 / 2017-11-16
===================
- Upgrade Docker container to `node:8.9.1-alpine`
- Remove redundant `--` for forwarding script options
- Update npm dependencies
- Lint frontend JS
- Wrap frontend JS in IIFE

0.19.0 / 2017-10-31
===================
- Add basic authentication to service when running test environments in Rancher
- Upgrade Docker container to `node:8.8.1-alpine`
- Update npm dependencies

0.18.0 / 2017-10-17
===================
- Be less specific about third party domains within content security policy

0.17.0 / 2017-10-10
============
- Exclude subdomains from Strict-Transport-Security header
- Update npm dependencies

0.16.2 / 2017-10-3
===================
- Update all npm dependencies
- Use threshold file for performance testing for baseline

0.16.1 / 2017-09-13
===================
- Fix date format in CHANGELOG

0.16.0 / 2017-09-13
===================
- Update all available npm dependencies
- Update Docker container to node `8.4.0-alpine`
- Instrument application for Prometheus metric scraping
- Add CHANGELOG

0.15.0 / 2017-08-18
===================
- Allow Elasticsearch host to be configured via env var `ES_HOST`

0.14.0 / 2017-08-17
===================
- Accessibility improvements
- Use frontend-library `0.5.1`

0.13.0 / 2017-08-08
===================
- Fix bug when `search` parameter is omitted from query

0.12.0 / 2017-08-07
===================
- Add WebTrends tags for displayed and total result count
- Allow displayed results limit to be set from env
- Allow a specific branch/tag/commit of the CI scripts to be used
- Remove references to 'FS Me' font

0.11.0 / 2017-08-07
===================
- Update dependencies

0.10.0 / 2017-08-03
===================
- Send logs to Splunk in JSON
- Analytics improvements for non-England searches
- Allow setting of container scale via ENV var
- Update frontend-library version to `0.5.0`
- Make page title and page H1 consistent

0.9.0 / 2017-07-24
==================
- Migrate app to use frontend-library

0.8.0 / 2017-07-18
==================
- Add search by postcode functionality

0.7.0 / 2017-07-13
==================
- Upgrade to node `8.1.4` to address security issue
- Improvements to documentation
- Update dependencies

0.6.0 / 2017-06-09
==================
- The use of a new query to provide better results. Specifically, searches
  where words are in a different order by 1 word will now match. The use of
  common query terms to provide more appropriate scoring on searches with
  common terms such as medical, health, center, etc.
- Clearer direction via the wording surrounding the input of search terms

0.5.0 / 2017-05-31
==================
- Frontend code spring clean
- Minified `jquery.mark.min.js`, `details.polyfill.js`
- Add versioning to JS files

0.4.0 / 2017-05-25
==================
- Replace MongoDB with Elasticsearch

0.3.1 / 2017-05-18
==================
- Fix whole word highlighting
- Fix for search again

0.3.0 / 2017-05-17
==================
- Add doctors search functionality
- Content / design improvements based on lab
- Highlighting with mark.js
- Upgraded to version 0.9.0 of the profiles-db

0.2.11 / 2017-04-27
===================
- Change npm to yarn
- Add scripts and refactor README
- Changed font to Frutiger
- Upgraded to version 0.8.0 of the profiles-db

0.2.10 / 2017-04-12
===================
- Webtrends tracking work
- Added polyfill.js
- GA Scroll depth analysis removed

< 0.2.10
========
- Foundational work on the application
- Initial designs
