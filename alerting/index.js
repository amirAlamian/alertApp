const express = require("express");
const fs = require('fs')
const elasticsearch = require('elasticsearch');
const ca = fs.readFileSync(process.env.ELASTICSEARCH_SSL_CERTIFICATEAUTHORITIES)
const key = fs.readFileSync(process.env.SERVER_SSL_KEY)
const cert = fs.readFileSync(process.env.SERVER_SSL_CERTIFICATE)
const client = new elasticsearch.Client({
  // host: process.env.ELASTICSEARCH_URL,
  log: 'trace',
  // auth: {
  //   username: 'elastic',
  //   password: 'o7RMngoWR4PvQYyESrRz'
  // },
  host: [
    {
      host: 'elasticsearch',
      auth: 'elastic:o7RMngoWR4PvQYyESrRz',
      protocol: 'https',
      port: 9200
    }
  ],
  // apiVersion: '7.9', // use the same version of your Elasticsearch instance
  ssl: {
    ca: fs.readFileSync(process.env.ELASTICSEARCH_SSL_CERTIFICATEAUTHORITIES),
    key: fs.readFileSync(process.env.SERVER_SSL_KEY),
    cert: fs.readFileSync(process.env.SERVER_SSL_CERTIFICATE),
    rejectUnauthorized: false
  }
});
console.log(`process.env.ELASTICSEARCH_URL`, process.env.ELASTICSEARCH_URL);
console.log(`fs.readFileSync(process.env.SERVER_SSL_CERTIFICATE)`, ca);
console.log(`fs.readFileSync(process.env.SERVER_SSL_KEY)`, cert);
console.log(`fs.readFileSync(process.env.SERVER_SSL_CERTIFICATE)`, key);

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!',error);
  } else {
    console.log('All is well');
  }
});
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`app listening on ${port} port!`));
