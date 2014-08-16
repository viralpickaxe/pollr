function notification_show(notification,type,callback){
  var callback = callback || function(){};
  var $notif = $('.notification');

  $notif.html(notification);
  $notif.addClass(type).show('slide',{direction:'up'},function(){
    callback();
  });
  setTimeout(function(){
    notification_hide();
  },3000);
}

function notification_hide(callback){
  var callback = callback || function(){};
  var $notif = $('.notification');

  $notif.hide('slide',{direction:'up'},function(){
    $notif.html('');
    callback();
  });
}