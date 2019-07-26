require('dotenv').config();

const { createServer } = require('http');

const app = require('./src/app');

const PORT = process.env.PORT ;

const server = createServer(app) ; 

server.listen(PORT , () => {
  console.log(`server is runnig on port ${PORT} ...`);      
});
