
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
var playerr = [];
var playerg = [];
var playerb = [];
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

var bbuugg = 0;

var mapsize = 5;

var hypo;
var angle;


for(var buggee = 0; buggee < (mapsize*mapsize)*10; buggee++){
	buggeesx.push(getRandomArbitrary((-1000*mapsize), (1000*mapsize)));
	buggeesy.push(getRandomArbitrary((-1000*mapsize), (1000*mapsize)));
	/*buggeesr.push(getRandomArbitrary(0, 255));
	buggeesg.push(getRandomArbitrary(0, 255));
	buggeesb.push(getRandomArbitrary(0, 255));*/
	buggeesalive.push(true);
	bugsliving++;
	bbuugg = buggeesalive.length;
}

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  playersonline++;
  playersx.push(getRandomArbitrary((-500*mapsize), (500*mapsize)));
  playersy.push(getRandomArbitrary((-500*mapsize), (500*mapsize)));
  playerr.push(getRandomArbitrary(50, 230));
  playerg.push(getRandomArbitrary(50, 230));
  playerb.push(getRandomArbitrary(50, 230));
  
  //socket.broadcast.emit("newplayer", 0, 0);
  socket.emit("mapsize", mapsize);
	
  socket.on('sid', function(clientid, nickname){
	clients.push(clientid);
	nicknames.push(nickname);
	
	//socket.emit("color", playerr[clients.indexOf(clientid)], playerg[clients.indexOf(clientid)], playerb[clients.indexOf(clientid)]);
	socket.broadcast.emit('cid', clientid, playersonline, nickname, playersx[clients.indexOf(clientid)], playersy[clients.indexOf(clientid)], playerr[clients.indexOf(clientid)], playerg[clients.indexOf(clientid)], playerb[clients.indexOf(clientid)]);
	//socket.emit('you', playersx[clients.indexOf(clientid)], playersy[clients.indexOf(clientid)]);
	for(var c = 0; c < clients.length; c++){
		socket.emit('them', playersx[c], playersy[c], clients[c], nicknames[c], playerr[c], playerg[c], playerb[c]);
	}
	for(var b = 0; b < buggeesalive.length; b++){
		if(buggeesalive[b] == true){
			socket.emit('bugs', buggeesx[b], buggeesy[b], buggeesalive[b]);
		}
	}
  });
	
  for(var n = 0; n < clickx.length; n++){
		socket.emit('click', clickx[n], clicky[n]);
  }
	
	
	setInterval(function(){
		if(buggeesalive.length < 10000){
			buggeesx.push(getRandomArbitrary((-1000*mapsize), (1000*mapsize)));
			buggeesy.push(getRandomArbitrary((-1000*mapsize), (1000*mapsize)));
			/*buggeesr.push(getRandomArbitrary(0, 255));
			buggeesg.push(getRandomArbitrary(0, 255));
			buggeesb.push(getRandomArbitrary(0, 255));*/
			buggeesalive.push(true);
			bugsliving++;
			socket.emit('bugs', buggeesx[bbuugg], buggeesy[bbuugg], buggeesalive[bbuugg]);
			bbuugg = buggeesalive.length;
		}
	}, 100);
	
	
	
  socket.on('disconnect', function(){
    console.log('user disconnected');
    playersonline--;
  });
	
  socket.on('click', function(x, y){
      //console.log('Somebody clicked at: ' + x + ", " + y);
	  clickx.push(x);
	  clicky.push(y);
	  socket.broadcast.emit('click', x, y);
  });

  
  socket.on('mrqst', function(ID, dx, dy){
	  hypo = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	  angle = Math.atan(dx/dy);
	  //console.log(dx + ", " + dy);
	  //console.log(angle);
	  
	  if(angle < 0&&dx > 0&&dy < 0){
		  playersx[clients.indexOf(ID)] -= Math.sin(angle)*5;
		  playersy[clients.indexOf(ID)] -= Math.cos(angle)*5;
	  }
	  if(angle > 0&&dx < 0&&dy < 0){
		  playersx[clients.indexOf(ID)] -= Math.sin(angle)*5;
		  playersy[clients.indexOf(ID)] -= Math.cos(angle)*5;
	  }
	  if(angle < 0&&dx < 0&&dy > 0){
		  playersx[clients.indexOf(ID)] += Math.sin(angle)*5;
		  playersy[clients.indexOf(ID)] += Math.cos(angle)*5;
	  }
	  if(angle > 0&&dx > 0&&dy > 0){
		  playersx[clients.indexOf(ID)] += Math.sin(angle)*5;
		  playersy[clients.indexOf(ID)] += Math.cos(angle)*5;
	  }
	  
	for(var bug = 0; bug < buggeesalive.length; bug++){
		if(buggeesalive[bug] == true){
			if(Math.sqrt(Math.pow((Math.abs(playersx[clients.indexOf(ID)]) - Math.abs(buggeesx[bug])), 2) + Math.pow((Math.abs(playersy[clients.indexOf(ID)]) - Math.abs(buggeesy[bug])), 2)) < 100){
				buggeesalive[bug] = false;
				bugsliving--;
				socket.emit('deadbug', buggeesx[bug]);
				socket.broadcast.emit('deadbug', buggeesx[bug]);
			}
		}
	}	
	  
	  socket.emit('mover', playersx[clients.indexOf(ID)], playersy[clients.indexOf(ID)], ID);
	  socket.broadcast.emit('mover', playersx[clients.indexOf(ID)], playersy[clients.indexOf(ID)], ID);
  });
	
  /*socket.on('mlrqst', function(theclientsID){
	playersx[clients.indexOf(theclientsID)] -= 2;
	socket.emit('ml', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	socket.broadcast.emit('ml', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	for(var bug = 0; bug < buggeesalive.length; bug++){
		if(buggeesalive[bug] == true){
			if(Math.sqrt(Math.pow((Math.abs(playersx[clients.indexOf(theclientsID)]) - Math.abs(buggeesx[bug])), 2) + Math.pow((Math.abs(playersy[clients.indexOf(theclientsID)]) - Math.abs(buggeesy[bug])), 2)) < 100){
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
	for(var bugr = 0; bugr < buggeesalive.length; bugr++){
		if(buggeesalive[bugr] == true){
			if(Math.sqrt(Math.pow((Math.abs(playersx[clients.indexOf(theclientsID)]) - Math.abs(buggeesx[bugr])) + (Math.abs(playersy[clients.indexOf(theclientsID)]) - Math.abs(buggeesy[bugr])), 2)) < 100){
				buggeesalive[bugr] = false;
				bugsliving--;
				socket.emit('deadbug', bugr);
				socket.broadcast.emit('deadbug', bugr);
			}
		}
	}
  });	
  socket.on('murqst', function(theclientsID){
	playersy[clients.indexOf(theclientsID)] -= 2;
	socket.emit('mu', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	socket.broadcast.emit('mu', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	for(var bugu = 0; bugu < buggeesalive.length; bugu++){
		if(buggeesalive[bugu] == true){
			if(Math.sqrt(Math.pow((Math.abs(playersx[clients.indexOf(theclientsID)]) - Math.abs(buggeesx[bugu])) + (Math.abs(playersy[clients.indexOf(theclientsID)]) - Math.abs(buggeesy[bugu])), 2)) < 100){
				buggeesalive[bugu] = false;
				bugsliving--;
				socket.emit('deadbug', bugu);
				socket.broadcast.emit('deadbug', bugu);
			}
		}
	}
  });	
  socket.on('mdrqst', function(theclientsID){
	playersy[clients.indexOf(theclientsID)] += 2;
	socket.emit('md', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	socket.broadcast.emit('md', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)], theclientsID);
	for(var bugd = 0; bugd < buggeesalive.length; bugd++){
		if(buggeesalive[bugd] == true){
			if(Math.sqrt(Math.pow((Math.abs(playersx[clients.indexOf(theclientsID)]) - Math.abs(buggeesx[bugd])) + (Math.abs(playersy[clients.indexOf(theclientsID)]) - Math.abs(buggeesy[bugd])), 2)) < 100){
				buggeesalive[bugd] = false;
				bugsliving--;
				socket.emit('deadbug', bugd);
				socket.broadcast.emit('deadbug', bugd);
			}
		}
	}
  });*/
 
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
