var cluster = require('cluster');
var https = require('https'); // May start using eventually
var http = require('http');
var fs = require('fs');
var path = require('path');

var Config = require('edc-web-sdk/config/customConfig');

module.exports = function(app, logger) {
  app.configMgr = new Config(app);

  // If running locally
  if (process.env.NODE_ENV !== 'production' && !process.env.ENV_HOST) {
    var proxy = require('express-http-proxy');
    var hostname = process.env.HOSTNAME || process.env.HOST || 'www';

    // Proxy api requests from 3000 to 4000 (Rails App)
    app.use(
      '/api',
      proxy('http://' + hostname + '.lvh.me:4000/api', {
        proxyReqPathResolver: function(req, res) {
          var p = '/api' + require('url').parse(req.url).path;
          return p;
        }
      })
    );

    // Proxy asset requests
    app.use(
      '/assets',
      proxy('http://' + hostname + '.lvh.me:4000/assets', {
        proxyReqPathResolver: function(req, res) {
          return '/assets' + require('url').parse(req.url).path;
        }
      })
    );

    // Proxy auth requests
    app.use(
      '/auth',
      proxy('http://' + hostname + '.lvh.me:4000/auth', {
        proxyReqPathResolver: function(req, res) {
          return '/auth' + require('url').parse(req.url).path;
        }
      })
    );

    // Proxy auth requests
    app.use(
      '/sign_out',
      proxy('http://' + hostname + '.lvh.me:4000/sign_out', {
        proxyReqPathResolver: function(req, res) {
          return '/sign_out' + require('url').parse(req.url).path;
        }
      })
    );

    // Proxy cms requests
    app.use(
      '/cms',
      proxy('http://' + hostname + '.lvh.me:4000/cms', {
        proxyReqPathResolver: function(req, res) {
          return '/cms' + require('url').parse(req.url).path;
        }
      })
    );

    // Proxy collections requests
    app.use(
      '/collections.json',
      proxy('http://' + hostname + '.lvh.me:4000/collections.json', {
        proxyReqPathResolver: function(req, res) {
          return '/collections.json' + require('url').parse(req.url).path;
        }
      })
    );

    app.use(
      '/collections',
      proxy('http://' + hostname + '.lvh.me:4000/collections', {
        proxyReqPathResolver: function(req, res) {
          return '/collections' + require('url').parse(req.url).path;
        }
      })
    );

    app.use(
      '/corp',
      proxy('http://' + hostname + '.lvh.me:4000/corp', {
        proxyReqPathResolver: function(req, res) {
          var p = '/corp' + require('url').parse(req.url).path;
          return p;
        }
      })
    );

    app.use(
      '/metric_recorder.json',
      proxy('http://' + hostname + '.lvh.me:4000/metric_recorder.json', {
        proxyReqPathResolver: function(req, res) {
          return '/metric_recorder.json' + require('url').parse(req.url).path;
        }
      })
    );

    // System assets requests
    app.use(
      '/system',
      proxy('http://' + hostname + '.lvh.me:4000/system', {
        proxyReqPathResolver: function(req, res) {
          return '/system' + require('url').parse(req.url).path;
        }
      })
    );

    // Link resource preview
    app.use(
      '/dialog/share/preview.json',
      proxy('http://' + hostname + '.lvh.me:4000/dialog/share/preview.json', {
        proxyReqPathResolver: function(req, res) {
          return '/dialog/share/preview.json' + require('url').parse(req.url).path;
        }
      })
    );

    // File Resource requests
    app.use(
      '/file_resources',
      proxy('http://' + hostname + '.lvh.me:4000/file_resources', {
        proxyReqPathResolver: function(req, res) {
          return '/file_resources' + require('url').parse(req.url).path;
        }
      })
    );

    // User Requests
    app.use(
      '/users',
      proxy('http://' + hostname + '.lvh.me:4000/users', {
        proxyReqPathResolver: function(req, res) {
          return '/users' + require('url').parse(req.url).path;
        }
      })
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    var _port = process.env.PORT || 4001;

    if (process.env.LOCAL_SSL === 'true') {
      https
        .createServer(
          {
            key: fs.readFileSync(path.resolve(__dirname, './ssl/lvh.key'), 'utf8'),
            cert: fs.readFileSync(path.resolve(__dirname, './ssl/lvh.cert'), 'utf8'),
            requestCert: false,
            rejectUnauthorized: false
          },
          app
        )
        .listen(8080);
      logger.info('Started application successfully on https.', {
        environment: process.env.NODE_ENV || 'development',
        cpu: require('os').cpus().length,
        port: 8080
      });
    } else {
      http.createServer(app).listen(_port);
      logger.info('Started application successfully.', {
        environment: process.env.NODE_ENV || 'development',
        cpu: require('os').cpus().length,
        port: _port
      });
    }
  } else {
    // If running on AWS
    if (cluster.isMaster) {
      var cpuCount = require('os').cpus().length;
      for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
      }
      // configMgr.logConfig();
      logger.info('Started application successfully.', {
        environment: process.env.NODE_ENV,
        version: require('../../version.json').v,
        cpu: require('os').cpus().length
      });

      cluster.on('online', function(worker) {
        logger.info('Worker ' + worker.process.pid + ' is online');
      });

      cluster.on('exit', function(worker, code, signal) {
        cluster.fork();
        logger.error(
          'Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal
        );
        logger.error('Starting a new worker');
      });
    } else {
      const port = process.env.PORT || 8080;
      http.createServer(app).listen(port);
    }
  }
};
