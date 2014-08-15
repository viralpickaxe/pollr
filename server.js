var express = require('express');
var http = require('http');
var socket = require('socket.io');
var path = require('path');

var port = Number(process.env.PORT || 3000)

var app = express();
var server = http.Server(app);
var io = socket(server);

var test = 'hello';

server.listen(port, function(){
  console.log('listening on *:' + port);
});

app.get('/', function(req, res){
  res.sendfile('./views/newquestion.html');
  io.on('connection', function(socket){
    socket.on('question:create:req', function(data){
      var question = {
        name: data.name,
        url: encodeURIComponent(data.name.replace(/ /g,'-'))
      }
      socket.emit('question:create:res',{created:true,questiondata:question});
    });
  });
});

app.get('/:pollurl', function(req, res){
  res.sendfile('./views/poll.html');
  var pollurl = req.params.pollurl;
  console.log(pollurl);
});

app.use(express.static(path.join(__dirname, 'public')));