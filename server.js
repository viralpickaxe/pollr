var express = require('express');
var http = require('http');
var socket = require('socket.io');
var path = require('path');

var port = Number(process.env.PORT || 3000)

var app = express();
var server = http.Server(app);
var io = socket(server);

var Questions = {};

server.listen(port, function(){
  console.log('listening on *:' + port);
});

app.get('/', function(req, res){
  res.sendfile('./views/newquestion.html');
});

app.get('/create/:questionname', function(req, res){
  var rawquestionname = req.params.questionname;

  var question = {
    name: rawquestionname,
    url: encodeURIComponent(rawquestionname.replace(/[^\w\s]/gi, '').replace(/ /g,'-')),
    results: {
      yes: 0,
      no: 0
    }
  }

  if(typeof(Questions[question.url])=='undefined'){
    Questions[question.url] = question;
    res.send({created:true,questiondata:question});
  } else {
    res.send({created:false,msg:"Hmm... Looks like someone's already asked that."});
  }
});

app.get('/:pollurl', function(req, res){
  res.sendfile('./views/poll.html');

  var pollurl = req.params.pollurl;

  io.on('connection', function(socket){
    socket.on('ping', function(data){
      var question = Questions[data.questionurl];
      if(typeof(question)!='undefined'){
        socket.currentQuestion = data.questionurl;
        socket.emit('pong',question);
      } else {
        socket.emit('pong',false);
      }
    });
  });
});

io.on('connection', function(socket){
  socket.on('voteCreate', function(data){
    console.log('Recieved vote: ' + data.value);
    if(typeof(Questions[data.question])!='undefined'){
      if(data.value==1){
        Questions[data.question].results.yes += 1;
      } else if(data.value==-1){
        Questions[data.question].results.no += 1;
      }
      io.emit('voteRelay',{questiondata:Questions[data.question],votedata:data.value});
    }
  });
});

app.use(express.static(path.join(__dirname, 'public')));