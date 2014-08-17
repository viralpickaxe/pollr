var socket = io();

$(document).ready(function(){
  window.Question = {}

  window.questionstring = window.location.pathname.substring(1);
  $('.question-string').html(questionstring.replace('-',' '));

  socket.emit('ping',{questionurl:questionstring});
  socket.on('pong',function(data){
    if(data===false){
      window.location.href = '/';
    } else {
      Question = data;
      $('.question-string').text(Question.name);
      updateCounters();
      setTimeout(function(){
        $('main.loading').hide();
        $('main.hidden').show();
      },500);
    }
  });

  socket.on('voteRelay',function(data){
    Question.results.yes = data.questiondata.results.yes;
    Question.results.no = data.questiondata.results.no;
    updateCounters();
    if(data.votedata==1){
      makeGlow($('.yes-btn'));
    } else if(data.votedata==-1){
      makeGlow($('.no-btn'));
    }
  });
});

$('.buttons').on('click','.yes-btn,.no-btn',function(){
  var $this = $(this);
  socket.emit('voteCreate',{question:questionstring,value:parseInt($this.attr('data-value'))});
  makeGlow($this);
});

function updateCounters(){
  $('.yes-count').html(Question.results.yes);
  $('.no-count').html(Question.results.no);
}

function makeGlow(thisel){
  var $this = thisel;
  $this.addClass('clicked');
  setTimeout(function(){
    $this.removeClass('clicked');
  },200);
}

setInterval(function(){
  var check = socket.emit('check up',{});
  if(check.disconnected){
    notification_show("I seem to of lost connection :'(",'error',999999);
    clearInterval();
  }
},2000);