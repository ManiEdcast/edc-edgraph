/**
User Auth CORS route
**/

var request = require('superagent');

module.exports = function(app) {
  app.use('/wapi/user/auth', corsAuth);
  console.log('check this one module.exports ')
  // CORS function for user auth
  function corsAuth(req, res) {
    console.log('check this one == ', req, ' == ', res)

    let origin = req.headers.origin;
    let host = req.headers.host;
    let headers = Object.assign({}, req.headers);
    // Set allowed cors
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Headers', 'X-UserToken, X-Api-Token, Accept, Content-Type');
    res.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    // Proxy to regular API
    request
      .get(`https://${host}/api/users/info.json`)
      .set(headers)
      .end((err, resp) => {
        if (err) {
          return res.json({
            unauthorzied: true
          });
        }
        // Add some checking here
        res.send(resp.body);
      });
  }
};
