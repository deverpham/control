var spawn = require('child_process').exec;
var ls = spawn('ahihi');
var process = require('process');
var express = require('express');
var app = express();
var io = require('socket.io')(3000);
app.set('view engine', 'ejs');
app.set('views', './views');
app.use("/public", express.static(__dirname + "/public"));
app.get('/', function (req, res) {
    res.render('index.ejs');
});
app.listen(80, function () {
    console.log("Server Start On Port 3000");
});
var user = 0;
io.on('connection', function (socket) {
    var sessionuser = user++;
    console.log("new connect " + user);
    socket.on('disconnect', function () {
        console.log(sessionuser + " disconnect");
        ls.kill();
    });
    socket.on('botstart', function (data) {
        var error = false;
        var loginsuccess = false;
        var useraccount = data.info;
        var execstring;
        if (useraccount.location == '') {
            execstring = "cd ../PokemonGo-Bot; python ./pokecli.py -a " + useraccount.accounttype + " -u '" + useraccount.username + "' -p '" + useraccount.password + "' ";
        }
        else {
            execstring = "cd ../PokemonGo-Bot; python ./pokecli.py -a " + useraccount.accounttype + " -u '" + useraccount.username + "' -p '" + useraccount.password + "' -l \"" + useraccount.location + "\"";
        }
        ls = spawn(execstring);
        ls.stderr.on('data', function (data) {
            var check = data.search('NotLoggedInException');
            if (check == -1) {
                check = data.search('api_error');
            }
            if (check == -1) {
                check = data.search('login_failed');
            }
            if (!error) {
                console.log(data);
                if (check != -1) {
                    console.log(data);
                    socket.emit('erroraccount', { info: data });
                    error = true;
                }
                else {
                    if (!loginsuccess) {
                        if (data.search('Level') != -1) {
                            loginsuccess = true;
                        }
                    }
                    else {
                        socket.on('disconnect', function () {
                            try {
                                process.kill(ls.pid + 1);
                            }
                            catch (e) {
                                console.log(e);
                            }
                        });
                        if (data.search('item_discard_skipped') == -1) {
                            socket.emit('loginfo', { info: data });
                        }
                    }
                }
            }
        });
        ls.stdout.on('data', function (data) {
            var log = data;
            console.log(log);
            socket.emit('loginfo', { info: log });
        });
    });
});
