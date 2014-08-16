var socket = io();

$(document).ready(function(){
  $('#newquestionform .question').focus().keyup();
});

$('#newquestionform').on('submit',function(){
  var $question = $('.question',$(this)),
  $askbtn = $('.askbtn',$(this));
  
  if(!$askbtn.attr('disabled')){
    $askbtn.attr('disabled',true).addClass('active');
    $question.attr('disabled',true);
    setTimeout(function(){
      $.get("/create/" + encodeURIComponent($question.val()), function( data ) {
        if(data.created){
          window.location.href = '/' + data.questiondata.url;
        } else {
          $askbtn.attr('disabled',false).removeClass('active');
          $question.attr('disabled',false).focus();
          console.log(data.msg);
        }
      });
    },200);
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