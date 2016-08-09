declare const require;
declare const __dirname;

const spawn =require('child_process').exec;
let ls = spawn('ahihi');
const process =require('process');
var express = require('express');
var app = express();
var io = require('socket.io')(3000);
app.set('view engine', 'ejs');
app.set('views','./views');
app.use("/public", express.static(__dirname + "/public"));
app.get('/',(req,res) => {
  res.render('index.ejs');
});
app.listen(80,()=> {
  console.log(`Server Start On Port 3000`);
});
let user : number =0;
io.on('connection',(socket) => {

  var sessionuser =user++;
  console.log(`new connect ${user}`);
  socket.on('disconnect',()=>{
    console.log(`${sessionuser} disconnect`);
    ls.kill();
  });
  socket.on('botstart',(data)=> {
    let error :boolean =false;
    let loginsuccess : boolean= false;
   let useraccount = data.info;
   let execstring : string = `cd ../PokemonGo-Bot; python ./pokecli.py -u ${useraccount.username} -p ${useraccount.password}`;
    ls = spawn(execstring);
   ls.stderr.on('data', (data) => {
     let check =data.search('NotLoggedInException');
     if(!error ) {

  console.log(data);
     if(check!=-1) {
       console.log(data);
         socket.emit('erroraccount', {info : data});
         error=true;
     }
     else {
       if(!loginsuccess) {
       if(data.search('Level')!=-1) {
         loginsuccess=true;
       }
     }
     else {
       socket.on('disconnect',()=>{
         process.kill(ls.pid+1);
       });
       socket.emit('loginfo', {info : data});
     }
   }
    }
});
   ls.stdout.on('data', (data) => {
     let log = data;
     console.log(log)
  socket.emit('loginfo', {info : log});

});

  });
});
