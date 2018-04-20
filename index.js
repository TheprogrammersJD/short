
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var clickx = [];
var clicky = [];

//var socketID = Math.round((Math.random() * 10000))*Math.round(Math.random() * 10);

var playersx = [];
var playersy = [];
var playersonline = 0;
var clients = [];
var nicknames = [];
var playercolors = [];
var buggeesx = [];
var buggeesy = [];
/*var buggeesr = [];
var buggeesg = [];
var buggeesb = [];*/
var buggeesalive = [];
var bugsliving = 0;

var mapsize = 5;


for(var bug = 0; bug < (mapsize*mapsize)*10; bug++){
	buggeesx.push(getRandomArbitrary((-1000*mapsize), (1000*mapsize)));
	buggeesy.push(getRandomArbitrary((-1000*mapsize), (1000*mapsize)));
	/*buggeesr.push(getRandomArbitrary(0, 255));
	buggeesg.push(getRandomArbitrary(0, 255));
	buggeesb.push(getRandomArbitrary(0, 255));*/
	buggeesalive.push(true);
	bugsliving++;
}

setInterval(function(){
	if(buggeesalive.length){
		buggeesx.push(getRandomArbitrary((-1000*mapsize), (1000*mapsize)));
		buggeesy.push(getRandomArbitrary((-1000*mapsize), (1000*mapsize)));
		/*buggeesr.push(getRandomArbitrary(0, 255));
		buggeesg.push(getRandomArbitrary(0, 255));
		buggeesb.push(getRandomArbitrary(0, 255));*/
		buggeesalive.push(true);
		bugsliving++;
	}
}, 10);

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  playersonline++;
  playersx.push(getRandomArbitrary((-500*mapsize), (500*mapsize)));
  playersy.push(getRandomArbitrary((-500*mapsize), (500*mapsize)));
  
  //socket.broadcast.emit("newplayer", 0, 0);
  socket.emit("mapsize", mapsize);
    
  socket.on('sid', function(clientid, nickname){
	clients.push(clientid);
	nicknames.push(nickname);
	socket.broadcast.emit('cid', clientid, playersonline, nickname, playersx[clients.indexOf(clientid)], playersy[clients.indexOf(clientid)]);
	//socket.emit('you', playersx[clients.indexOf(clientid)], playersy[clients.indexOf(clientid)]);
	for(var c = 0; c < clients.length; c++){
		socket.emit('them', playersx[c], playersy[c], clients[c], nicknames[c]);
	}
	for(var b = 0; b < buggeesalive.length; b++){
		socket.emit('bugs', buggeesx[b], buggeesy[b], buggeesalive[b]);
	}
  });
	
  for(var n = 0; n < clickx.length; n++){
		socket.emit('click', clickx[n], clicky[n]);
  }
	
  socket.on('disconnect', function(){
    console.log('user disconnected');
    playersonline--;
  });
	
  socket.on('click', function(x, y){
    console.log('Somebody clicked at: ' + x + ", " + y);
	  clickx.push(x);
	  clicky.push(y);
	  socket.broadcast.emit('click', x, y);
  });

	
  socket.on('mlrqst', function(theclientsID){
	playersx[clients.indexOf(theclientsID)] -= 2;
	socket.emit('ml', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	socket.broadcast.emit('ml', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	for(var bug = 0; bug < buggeesalive.length; bug++){
		if(buggeesalive[bug] == true){
			if(Math.pow((playersx[clients.indexOf(theclientsID)] - buggeesx[bug]) + (playersy[clients.indexOf(theclientsID)] - buggeesy[bug]), 2) < 100){
				buggeesalive[bug] = false;
				bugsliving--;
				socket.emit('deadbug', bug);
				socket.broadcast.emit('deadbug', bug);
			}
		}
	}
  });	
  socket.on('mrrqst', function(theclientsID){
	playersx[clients.indexOf(theclientsID)] += 2;
	socket.emit('mr', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	socket.broadcast.emit('mr', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	for(var bug = 0; bug < buggeesalive.length; bug++){
		if(buggeesalive[bug] == true){
			if(Math.pow((playersx[clients.indexOf(theclientsID)] - buggeesx[bug]) + (playersy[clients.indexOf(theclientsID)] - buggeesy[bug]), 2) < 100){
				buggeesalive[bug] = false;
				bugsliving--;
				socket.emit('deadbug', bug);
				socket.broadcast.emit('deadbug', bug);
			}
		}
	}
  });	
  socket.on('murqst', function(theclientsID){
	playersy[clients.indexOf(theclientsID)] -= 2;
	socket.emit('mu', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	socket.broadcast.emit('mu', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	for(var bug = 0; bug < buggeesalive.length; bug++){
		if(buggeesalive[bug] == true){
			if(Math.pow((playersx[clients.indexOf(theclientsID)] - buggeesx[bug]) + (playersy[clients.indexOf(theclientsID)] - buggeesy[bug]), 2) < 100){
				buggeesalive[bug] = false;
				bugsliving--;
				socket.emit('deadbug', bug);
				socket.broadcast.emit('deadbug', bug);
			}
		}
	}
  });	
  socket.on('mdrqst', function(theclientsID){
	playersy[clients.indexOf(theclientsID)] += 2;
	socket.emit('md', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	socket.broadcast.emit('md', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	for(var bug = 0; bug < buggeesalive.length; bug++){
		if(buggeesalive[bug] == true){
			if(Math.pow((playersx[clients.indexOf(theclientsID)] - buggeesx[bug]) + (playersy[clients.indexOf(theclientsID)] - buggeesy[bug]), 2) < 100){
				buggeesalive[bug] = false;
				bugsliving--;
				socket.emit('deadbug', bug);
				socket.broadcast.emit('deadbug', bug);
			}
		}
	}
  });
 
});

/*function players(){
	for(var i = 0; i < clients.length; i++){
		socket.emit('playerposition', playersx[i], playersy[i]);
		socket.broadcast.emit('playerposition', playersx[i], playersy[i]);
	}
}

setInterval(players, 500);*/

http.listen(port, function(){
  console.log('listening on *:' + port);
});

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
