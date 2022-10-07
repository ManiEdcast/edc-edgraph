/**
 * @module server/config/router
 */

 var express = require('express');
 var router = express.Router();
 var path = require('path');
 var request = require('superagent');
 var fs = require('fs');
 const https = require('https');
 
 var maintenance = false;
 
 module.exports = function(app) {
   var envVars = app.configMgr.getClientEnvVars();
   envVars.NODE_ENV = process.env.NODE_ENV;
 
 
   // read only once (version changes only on new build)
   var version = require(path.resolve('.') + '/version.json');
 
   // cache content of static index.html or maintenance.html page
   // TODO: to minify?
   var indexPagePath = path.resolve(
     __dirname,
     `static/${maintenance ? 'maintenance' : 'index'}.html`
   );
   var indexPageContent = fs.readFileSync(indexPagePath, 'utf8');
 
   var renderPage = function(req, res, meta = {}) {
     res.set('X-Frame-Options', 'sameorigin');
     res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
     let hostname = req.hostname;
     if (process.env.NODE_ENV === 'development') {
       try {
         hostname = process.env.ENV_HOST.split('//')[1];
       } catch (e) {}
     }
     getOrgInfo(hostname, function(resp) {
       let meta = {};
       if (resp) {
         meta = {
           image: resp.imageUrl || resp.bannerUrl || null,
           description: resp.description || null,
           title: resp.name || null
         };
 
         // We just need to make sure it's not empty
         if (resp.favicons && resp.favicons.tiny) {
           let sizes = {
             tiny: '16x16',
             small: '96x96',
             medium: '192x192',
             large: '32x32'
           };
           // Generate array of favicons
           meta.favicons = [];
           if (Object.keys(resp.favicons).length > 0) {
             Object.keys(sizes).forEach(function(key) {
               const link =
                 '<link rel="icon" href="' +
                 resp.favicons[key] +
                 '" type="image/x-icon" sizes="' +
                 sizes[key] +
                 '">';
               meta.favicons.push(link);
             });
           }
         }
       }
       // Everything should be handled by React Router
       var newParams = Object.assign(
         {},
         viewParams,
         { meta },
         { __edOrgData: resp }
       );
        console.log("check here router.js before page.html render")
       return res.render('page.html', newParams);
     });
   };
 
   // TODO: recover New Relic!
 
   function getOrgInfo(hostname, callback) {
     const options = {
       hostname: hostname,
       port: 443,
       path: '/api/v2/organizations/details.json',
       method: 'GET'
     };
 
     const req = https.request(options, res => {
       let body = '';
       res.on('data', d => {
         body += d;
       });
 
       res.on('end', function() {
         let resp = null;
         try {
           resp = JSON.parse(body);
         } catch (e) {}
         callback(resp);
       });
     });
 
     req.on('error', error => {
       console.error(error);
       callback(null);
     });
 
     req.end();
   }
 
   app.use('/log_in', function(req, res) {
     return renderPage(req, res);
   });
 
   const CORP_SITE_URL = `${process.env.CORP_SITE_URL || 'http://wp-corp.edcast.com/corp/'}`;
   const CORP_SITE_NAME = CORP_SITE_URL.match(/:\/\/(.[^/]+)/)[1];
 
   var re = new RegExp(CORP_SITE_NAME, 'g');
   if (process.env.NODE_ENV === 'production') {
     app.use('/', function(req, res, next) {
       if (req.path === '/' && req.hostname && req.hostname.split('.')[0] === 'www') {
         request.get(CORP_SITE_URL, function(err, resp) {
           var html = resp.text;
           html = html.replace(re, req.hostname);
           return res.send(html);
         });
       } else {
         return next();
       }
     });
   }
 
   // only static params that doesn't depend on such of process.env (because it's cached by service worker)
   const PATH = process.env.PROXY_VM ? process.env.PROXY_VM : 'localhost';
   var viewParams =
     process.env.NODE_ENV === 'production'
       ? {
           common: '/dist-' + version.v + '-common.chunk.js',
           bootstrap: '/dist-' + version.v + '-bootstrap.js',
           app: '/dist-' + version.v + '-main.js',
           css: '/dist-' + version.v + '-main.css',
           env_vars: JSON.stringify(envVars)
         }
       : {
           common: `http://${PATH}:8002/common.js`,
           bootstrap: `http://${PATH}:8002/bootstrap.js`,
           app: `http://${PATH}:8002/main.js`,
           css: `http://${PATH}:8002/main.css`,
           env_vars: JSON.stringify(envVars)
         };
 
   /* All page routes */
   router.get(['*'], function(req, res) {
     renderPage(req, res);
   });
 
   app.disable('etag');
 
   app.use('/', router);
 
   app.use(function(req, res, next) {
     res.redirect('/404');
   });
 };
 