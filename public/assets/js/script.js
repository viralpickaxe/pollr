function notification_show(notification,type,time){
  var time = time || 3000;
  var $notif = $('.notification');

  $notif.html(notification);
  $notif.removeClass('success error').addClass(type).show('slide',{direction:'up'});
  setTimeout(function(){
    notification_hide();
  },time);
}

function notification_hide(){
  var $notif = $('.notification');

  $notif.hide('slide',{direction:'up'},function(){
    $notif.html('').removeClass('success error');
  });
}