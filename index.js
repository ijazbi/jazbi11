'use strict';
const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();

app.use('/assets', express.static('assets'));

app.post('/plugin', (req, res) => {
  res.sendFile(__dirname + '/plugin.html');
});

app.get('/modal', (req, res) => {
  res.sendFile(__dirname + '/modal.html');
});

app.get('/logout', (req, res) => {
  res.sendFile(__dirname + '/modal-logged-out.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// All Hoosuite apps require HTTPS, so in order to host locally
// you must have some certs. They don't need to be issued by a CA for development,
// but for production they definitely do! Heroku adds its own TLS,
// so you don't have to worry about it as long as TLS is enabled on your Heroku app.
if (fs.existsSync('certs/server.crt') && fs.existsSync('certs/server.key')) {
  const certificate = fs.readFileSync('certs/server.crt').toString();
  const privateKey = fs.readFileSync('certs/server.key').toString();
  const options = {key: privateKey, cert: certificate};

  var server = https.createServer(options, app).listen(process.env.PORT || 5000);
  console.log(`Example app listening on port ${process.env.PORT || 5000}!`);
} else {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Example app listening on port ${process.env.PORT || 5000}!`);
  });
}
