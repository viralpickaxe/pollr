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

App = {
  Question: {
    yes: 0,
    no: 0,
    questionstring: "This is a question"
  }
}

app.get('/', function(req, res){
  res.sendfile('./views/newquestion.html');
});

app.get('/poll', function(req, res){
  res.sendfile('./views/poll.html');
});

app.use(express.static(path.join(__dirname, 'public')));

// io.on('connection', function(socket){
//   socket.on('ping', function(data){
//     console.log('ping!');
//     socket.emit('pong',App.Question);
//   });
//   socket.on('voteCreate', function(data){
//     console.log('Recieved vote: ' + data.value);
//     if(data.value==1){
//       App.Question.yes += 1;
//     } else if(data.value==-1){
//       App.Question.no += 1;
//     }
//     io.emit('voteRelay',{questiondata:App.Question,votedata:data.value});
//   });
//   socket.on('questionUpdateCreate',function(data){
//     if(data.value==''){
//       data.value = 'This is a question';
//     }
//     App.Question.questionstring = data.value;
//     App.Question.yes = 0;
//     App.Question.no = 0;
//     socket.broadcast.emit('questionUpdateRelay',data);
//     io.emit('voteRelay',{questiondata:App.Question,votedata:0});
//   });
// });