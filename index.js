
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

var mapsize;

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  playersonline++;
  playersx.push(0);
  playersy.push(0);
  
  //clients.push(socket.id);
  socket.broadcast.emit("playerposition", 0, 0);
  socket.emit("playerposition", 0, 0);
    
  socket.on('sid', function(clientid){
	clients.push(clientid);
	socket.broadcast.emit('cid', clientid, playersonline);
	//socket.emit('playerposition', playersx[clients.findIndex(findClient(socketID))], playersy[clients.findIndex(findClient(socketID))]);
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
	playersx[clients.indexOf(theclientsID)] += 1;
	socket.emit('ml', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)]);
	socket.broadcast.emit('ml', playersx[clients.indexOf(theclientsID)], playersy[clients.indexOf(theclientsID)]);
  });
 
});


http.listen(port, function(){
  console.log('listening on *:' + port);
});
