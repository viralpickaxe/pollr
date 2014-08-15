var express = require('express');
var http = require('http');
var socket = require('socket.io');
var path = require('path');

var port = Number(process.env.PORT || 3000)

var app = express();
var server = http.Server(app);
var io = socket(server);

server.listen(port, function(){
  console.log('listening on *:' + port);
});

app.get('/', function(req, res){
  res.sendfile('./views/newquestion.html');
});

app.use(express.static(path.join(__dirname, 'public')));