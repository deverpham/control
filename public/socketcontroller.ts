declare let $;
declare let Materialize;

class serverinfo  {
   host : string;
   port : number;
}
let server:serverinfo = {
   host : 'localhost',
   port :3000
}
let socket = io.connect(`${server.host}:${server.port}`);
socket.on('disconnect',()=>{
  console.log('server disconnect');
});
socket.on('loginfo',(data) => {
  $('.ahihi').remove();
  $('#loginfo').css('opacity','1');
  data.info = data.info.replace("[PokemonGoBot]",'');
  data.info = data.info.replace("[INFO]",'');
  data.info = data.info.replace("[moving_to_lured_fort]",'');
  data.info = data.info.replace("[MoveToFort]",'');
  data.info = data.info.replace("[pokestop_searching_too_often]",'');
  data.info = data.info.replace("[SpinFort]",'');
  data.info = data.info.replace("[IncubateEggs]",'');
  data.info = data.info.replace("[next_egg_incubates]",'');
  data.info = data.info.replace("[CollectLevelUpReward]",'');
  data.info = data.info.replace("[level_up_reward]",'');
  data.info = data.info.replace("[bot_start]",'');
  data.info = data.info.replace("[pokemon_caught]",'');
  data.info = data.info.replace("Trung no trong vong",'Trứng nở trong vòng');
  data.info = data.info.replace("PokemonCatchWorker",'Bắt Pokemon');
  $('#loginfo').append(data.info);
  let textarea = document.getElementById('loginfo');
  textarea.scrollTop = textarea.scrollHeight;
  console.log(data);

});
socket.on('erroraccount',(data)=> {
  Materialize.toast('Sai thông tin đăng nhập', 4000);
  $('button').text('Bắt Đầu BOT');
  $('button').removeClass('preloader-wrapper');
   $('button').attr('disabled',false);
  console.log(data);
});
if(!socket) {
  console.log('server disconnect');
}
function botstart(form)  {
 let userdata  =$(form).serializeObject();
 $('button').attr('disabled',true);
 $('button').text('Đang load.Ahihi')
 if(!userdata.accounttype) {
   userdata.accounttype='ptc';
 }
 if(!userdata.username || !userdata.password ) {
   alert('Điền username và password')
    $('button').removeClass('preloader-wrapper');
     $('button').attr('disabled',false);
     $('button').text('Bắt Đầu BOT');
 } else {
 console.log(userdata);
 socket.emit('botstart',{info : userdata });

 }
  return false;
}
