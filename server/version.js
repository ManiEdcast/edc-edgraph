var fs = require('fs');

if (process.env.NODE_ENV == 'production') {
  var v = { v: Date.now() };
  fs.writeFileSync(process.cwd() + '/version.json', JSON.stringify(v));
}
