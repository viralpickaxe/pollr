var socket = io();

$(document).ready(function(){
  $('#newquestionform .question').focus();
});

$('#newquestionform').on('submit',function(){
  var $question = $('.question',$(this)),
  $askbtn = $('.askbtn',$(this));
  
  if(!$askbtn.attr('disabled')){
    console.log('submitted');
    $askbtn.addClass('active');
    setTimeout(function(){
      $askbtn.removeClass('active');
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