var socket = io();

$(document).ready(function(){
  $('#newquestionform .question').focus();
});

$('#newquestionform .question').on('keyup',function(){
  var $question = $(this),
  $askbtn = $('#newquestionform .askbtn');

  if($question.val().length<=4){
    $askbtn.removeClass('visible');
  } else {
    $askbtn.addClass('visible');
  }
});