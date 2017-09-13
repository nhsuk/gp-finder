0.16.0 / 13-09-2017
===================
- Update all available npm dependencies
- Update Docker container to node `8.4.0-alpine`
- Instrument application for Prometheus metric scraping
- Add CHANGELOG

0.15.0 / 18-08-2017
===================
- Allow Elasticsearch host to be configured via env var `ES_HOST`

0.14.0 / 17-08-2017
===================
- Accessibility improvements
- Use frontend-library `0.5.1`

0.13.0 / 08-08-2017
===================
- Fix bug when `search` parameter is omitted from query

0.12.0 / 07-08-2017
===================
- Add WebTrends tags for displayed and total result count
- Allow displayed results limit to be set from env
- Allow a specific branch/tag/commit of the CI scripts to be used
- Remove references to 'FS Me' font

0.11.0 / 07-08-2017
===================
- Update dependencies

0.10.0 / 03-08-2017
===================
- Send logs to Splunk in JSON
- Analytics improvements for non-England searches
- Allow setting of container scale via ENV var
- Update frontend-library version to `0.5.0`
- Make page title and page H1 consistent

0.9.0 / 24-07-2017
==================
- Migrate app to use frontend-library

0.8.0 / 18-07-2017
==================
- Add search by postcode functionality

0.7.0 / 13-07-2017
==================
- Upgrade to node `8.1.4` to address security issue
- Improvements to documentation
- Update dependencies

0.6.0 / 09-06-2017
==================
- The use of a new query to provide better results. Specifically, searches
  where words are in a different order by 1 word will now match. The use of
  common query terms to provide more appropriate scoring on searches with
  common terms such as medical, health, center, etc.
- Clearer direction via the wording surrounding the input of search terms

0.5.0 / 31-05-2017
==================
- Frontend code spring clean
- Minified `jquery.mark.min.js`, `details.polyfill.js`
- Add versioning to JS files

0.4.0 / 25-05-2017
==================
- Replace MongoDB with Elasticsearch

0.3.1 / 18-05-2017
==================
- Fix whole word highlighting
- Fix for search again

0.3.0 / 17-05-2017
==================
- Add doctors search functionality
- Content / design improvements based on lab
- Highlighting with mark.js
- Upgraded to version 0.9.0 of the profiles-db

0.2.11 / 27-04-2017
==================
- Change npm to yarn
- Add scripts and refactor README
- Changed font to Frutiger
- Upgraded to version 0.8.0 of the profiles-db

0.2.10 / 12-04-2017
==================
- Webtrends tracking work
- Added polyfill.js
- GA Scroll depth analysis removed

< 0.2.10
========
- Foundational work on the application
- Initial designs
