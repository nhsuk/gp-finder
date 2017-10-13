const log = require('../app/lib/logger');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const nunjucks = require('nunjucks');
const router = require('./routes');
const locals = require('../app/middleware/locals');
const constants = require('../app/lib/constants');
const smartCache = require('../app/middleware/smartCache');
const promBundle = require('../app/lib/promBundle').middleware;
const errorCounter = require('../app/lib/promCounters').errorPageViews;

module.exports = (app, config) => {
  // eslint-disable-next-line no-param-reassign
  app.locals.SITE_ROOT = constants.SITE_ROOT;

  // start collecting default metrics
  promBundle.promClient.collectDefaultMetrics();

  app.use(smartCache({ maxAge: config.cacheTimeoutSeconds }));

  app.set('views', `${config.root}/app/views`);
  app.set('view engine', 'nunjucks');
  const nunjucksEnvironment =
    nunjucks.configure(`${config.root}/app/views`, {
      autoescape: true,
      express: app,
      watch: true,
    });

  log.info(nunjucksEnvironment, 'nunjucks environment configuration');

  app.use(helmet({
    frameguard: { action: 'deny' },
    hsts: { includeSubDomains: false },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          '\'self\'',
        ],
        childSrc: [
          '*.hotjar.com',
        ],
        scriptSrc: [
          '\'self\'',
          '\'unsafe-eval\'',
          '\'unsafe-inline\'',
          'data:',
          '*.google-analytics.com',
          '*.hotjar.com',
          '*.webtrends.com',
          '*.webtrendslive.com',
        ],
        imgSrc: [
          '\'self\'',
          'data:',
          '*.google-analytics.com',
          '*.hotjar.com',
          '*.webtrends.com',
          '*.webtrendslive.com',
        ],
        styleSrc: [
          '\'self\'',
          '\'unsafe-inline\'',
          'assets.nhs.uk',
        ],
        fontSrc: [
          'assets.nhs.uk',
        ],
        connectSrc: [
          '\'self\'',
          '*.hotjar.com:*',
        ],
      },
    }
  }));

  app.use(locals(config));

  app.use((req, res, next) => {
    log.debug({ req });
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));

  app.use(cookieParser());
  app.use(compression());

  app.use(constants.SITE_ROOT, express.static(`${config.root}/public`));

  // metrics needs to be registered before routes wishing to have metrics generated
  // see https://github.com/jochen-schweizer/express-prom-bundle#sample-uusage
  app.use(promBundle);
  app.use(constants.SITE_ROOT, router);
  app.use(constants.SITE_ROOT, (req, res) => {
    log.warn({ req }, 404);
    res.status(404);
    res.render('error-404');
  });

  // eslint-disable-next-line no-unused-vars
  app.use(constants.SITE_ROOT, (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    errorCounter.inc(1);
    log.error(err, 'Error');
    res.status(statusCode);
    res.render('error', {
      message: err,
      error: app.get('env') === 'development' ? err : {},
      title: 'error',
    });
  });

  app.get('/', (req, res) => {
    res.redirect(constants.SITE_ROOT);
  });
};
