var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var glob = require('glob');
var helmet = require('helmet');
var request = require('superagent');
var hpp = require('hpp');

const getCspJson = () => {
  const domain = process.env.CSP_REPORT_PATH;
  return new Promise((resolve, reject) => {
    return request.get(`${domain}`).end((err, response) => {
      if (!err && response.ok) {
        resolve(response);
      } else {
        resolve({});
      }
    });
  });
};

var application = async app => {
  // If passing in a defined application, reuse it
  if (!app) {
    app = express();
    console.log('Creating Express App');
  }
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(hpp());

  if (process.env.NODE_ENV === 'production') {
    // We need to set max age and cache control here
    // also on assets.js
    app.get(/.*dist\-.*(js|css)$/, function(req, res, next) {
      req.url = req.url + '.gz';
      res.set('Content-Encoding', 'gzip');
      switch (req.params[0]) {
        case 'css':
          res.set('Content-type', 'text/css');
          break;
        case 'js':
          res.set('Content-type', 'application/javascript');
          break;
        default:
          console.warn('Unspecified file extension in gzip production file handler.');
      }
      next();
    });
  }

  // set maxAge for 30 days
  // Disabled etag to fix security issue with Apache Server ETag Header Information Disclosure

  app.use(
    express.static(path.resolve('.') + '/public', {
      maxAge: '30d',
      etag: false
    })
  );

  if (process.env.NODE_ENV !== 'development') {
  
    app.use(
      bodyParser.json({
        type: ['application/json', 'application/csp-report', 'application/reports+json']
      })
    );

    const cspJson = await getCspJson();
    app.use(
      helmet.contentSecurityPolicy({
        useDefaults: false,
        directives: cspJson.body,
        reportOnly: process.env.ENFORCE_CSP === 'true'
      }),
      helmet.noSniff()
    );

    app.use((req, res, next) => {
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  app.disable('x-powered-by');
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );

  

  // require('./config/view')(app);
  var sink = {
    start: function() {
      glob.sync('./src/**/*.api.server.js').forEach(function(file) {
        console.log(`LOADING SERVER API: ${file}`);
        require(path.resolve(file))(app);
      });
      // Start our server
      require('./config/serverManager')(app);
      require('./config/router')(app);
    },

    getApp: function() {
      return app;
    }
  };

  module.exports = sink;
  return sink;
};

module.exports = application();
