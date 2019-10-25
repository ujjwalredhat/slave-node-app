const express = require('express');
var ip = require("ip");
const app = express();
const router = express.Router();
var bunyan = require('bunyan');
const uuid = require('uuid')
const id = uuid.v1()

//var PropertiesReader = require('properties-reader');
//var properties = PropertiesReader('../application.properties');

var start = Date.now();

var log = bunyan.createLogger({
      name: "Slave",
      streams: [{
      path: './slave.log',
    }]
  });

var targePort = process.env.NODE_APP_SLAVE_SERVICE_PORT;
//var targePort = properties.get('slave.node.targetPort');

const port = targePort;
var counter = 0;
var kill_switch = 0;

app.get('/', (request, response) => {
  if (kill_switch == 0) {
    var millis = Date.now() - start;

    response.send('.. slave running for ' + (millis / 1000) + ' seconds');
  }});

app.get('/ip', (request, response) => {
  var messageText = ip.address();
  counter++;
  log.info({app: 'slave', phase: 'operational', id: id, counter: counter, slave_ip: ip.address()}, " responded .... " + counter);
  response.json(messageText);
});

app.get('/kill', (request, response) => {
  var messageText = " Kill switch activated";
  counter++;
  log.info({app: 'slave', phase: 'operational', id: id, counter: counter, slave_ip: ip.address()}, " Kill switch activated");
  kill_switch++;
  response.json(messageText);
});

log.info( ip.address() );

// set the server to listen on the designated port
app.listen(port, () => log.info({app: 'slave', phase: 'setup', }, `Listening on port ${port}`));
