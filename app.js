require('dotenv').config();
require('./server')
  .then(server => server.start())
  .catch(err => console.log(`Error while start the server ${err}`));
