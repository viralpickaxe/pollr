var socket = io();

$(document).ready(function(){
  $('#newquestionform .question').focus().keyup();
});

$('#newquestionform').on('submit',function(){
  var $question = $('.question',$(this)),
  $askbtn = $('.askbtn',$(this));
  
  if(!$askbtn.attr('disabled')){
    console.log('submitted');
    $askbtn.attr('disabled',true).addClass('active');
    $question.attr('disabled',true);
    setTimeout(function(){
      socket.emit('question:create:req',{name:$question.val()});
      socket.on('question:create:res',function(data){
        if(data.created){
          window.location.href = '/' + data.questiondata.url;
        } else {
          $askbtn.attr('disabled',false).removeClass('active');
          $question.attr('disabled',false);
          console.log('error');
        }
      });
    },100);
  }
});

$('#newquestionform .question').on('keyup',function(){
  var $question = $(this),
  $askbtn = $('#newquestionform .askbtn');

  if($question.val().length<=4){
    $askbtn.attr('disabled',true).removeClass('visible');
  } else {
    $askbtn.attr('disabled',false).addClass('visible');
  }
});