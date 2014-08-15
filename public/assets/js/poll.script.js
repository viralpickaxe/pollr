var socket = io();

$(document).ready(function(){
  window.App = {
    yes: 0,
    no: 0
  }

  socket.emit('ping',{});
  socket.on('pong',function(data){
    $('.question-string').html(data.questionstring);
    App.yes = data.yes;
    App.no = data.no;
    updateCounters();
    console.log('pong!');
  });
  socket.on('voteRelay',function(data){
    App.yes = data.questiondata.yes;
    App.no = data.questiondata.no;
    updateCounters();
    if(data.votedata==1){
      makeGlow($('.yes-btn'));
    } else if(data.votedata==-1){
      makeGlow($('.no-btn'));
    }
  });
  socket.on('questionUpdateRelay',function(data){
    $('.question-string').html(data.value);
  });
});

$('.buttons').on('click','.yes-btn,.no-btn',function(){
  var $this = $(this);
  socket.emit('voteCreate',{value:parseInt($this.attr('data-value'))});
  makeGlow($this);
});

$('.question-string').on('click',function(){
  var $this = $(this);
  $this.attr('contenteditable','true');
});

$('.question-string').on('keydown',function(){
  var $this = $(this);
  setTimeout(function(){
    socket.emit('questionUpdateCreate',{value:$this.html()});
  },0);
});

function updateCounters(){
  $('.yes-count').html(App.yes);
  $('.no-count').html(App.no);
}

function makeGlow(thisel){
  var $this = thisel;
  $this.addClass('clicked');
  setTimeout(function(){
    $this.removeClass('clicked');
  },200);
}

function keydown_function(e) {
  var evtobj = window.event? event : e,
  cmdkey = evtobj.ctrlKey || evtobj.metaKey;
  if($('.question-string').attr('contenteditable')=='true'){
    if(evtobj.keyCode == 13){
      $('.question-string').blur();
    }
  }
  return true;
}

document.onkeydown = keydown_function;