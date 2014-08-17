var express = require('express');
var http = require('http');
var socket = require('socket.io');
var path = require('path');
var mongojs = require("mongojs");

var port = Number(process.env.PORT || 5000);

var dbusername = process.env.dbusername || "";
var dbpassword = process.env.dbpassword || "";
var dblocation = process.env.dblocation || "";
var dburi = "mongodb://" + dbusername + ":" + dbpassword + "@" + dblocation;

console.log(dburi);

var app = express();
var server = http.Server(app);
var io = socket(server).listen(server);
var db = mongojs.connect(dburi,["questions"]);

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
    url: encodeURIComponent(rawquestionname.toLowerCase().replace(/[^\w\s]/gi, '').replace(/ /g,'-')),
    results: {
      yes: 0,
      no: 0
    }
  }

  db.questions.find({"url": question.url}, function(err, records) {
    if(err==null){
      if(records.length==0){
        db.questions.insert(question);
        res.send({created:true,questiondata:question});
      } else {
        res.send({created:false,msg:"Hmm... Looks like someone's already asked that."});
      }
    } else {
      res.send({created:false,msg:"Beep boop. Err0r."});
    }
  });
});

app.get('/:pollurl', function(req, res){
  res.sendfile('./views/poll.html');
  var pollurl = req.params.pollurl;
});

io.on('connection', function(socket){
  console.log('connection');
  socket.on('ping', function(data){
    db.questions.find({url: data.questionurl}, function(err, records) {
      if(records.length!=0){
        socket.emit('pong',records[0]);
      } else {
        socket.emit('pong',false);
      }
    });
  });
  socket.on('voteCreate', function(data){
    console.log('Recieved vote: ' + data.value);
    db.questions.find({url: data.question}, function(err, records) {
      if(records.length!=0){
        if(data.value==1){
          records[0].results.yes += 1;
        } else if(data.value==-1){
          records[0].results.no += 1;
        }
        db.questions.update({"url":data.question}, {$set: {results:records[0].results}});
        io.emit('voteRelay',{questiondata:records[0],votedata:data.value});
      }
    });
  });
  socket.on('disconnect', function(){
    console.log('disconnection');
  });
});

app.use(express.static(path.join(__dirname, 'public')));