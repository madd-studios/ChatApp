// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var ws = require('ws');

import createError from 'http-errors';
import http from 'http';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { WebSocketServer, WebSocket } from 'ws';
import morgan from 'morgan';
import { router as indexRouter }  from './routes/index.js';
import { router as usersRouter } from './routes/users.js';
import { router as chatRouter } from './routes/chat.js';
import { fileURLToPath } from 'url';

// Set up a globally accessible list of long polling subscribers so chat.js can access the information...
// global.subscribers = Object.create(null);
global.subscribers = new Object(null);
global.wss = null;

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://masteringjs.io/tutorials/node/__dirname-is-not-defined

export var app = express();
export var server = http.createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lp_chat', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // This creates the error in the network tab of dev tools but doesn't show, see http-errors
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

global.wss = new WebSocketServer({ noServer: true });

// Heartbeat Functionality 
// If a websocket connection fails, the client needs to switch to long-polling

function heartbeat() {
  console.log("Response received from client!");
  this.isAlive = true;
}

const heartbeatMonitor = setInterval(() => {

  // console.log("HEARTBEAT ACTIVE");

  try {
    global.wss.clients.forEach((ws) => {

      if(!ws.isAlive) {
        ws.terminate();
        console.error("Closing down client...");
      } 
  
      ws.isAlive = false;
      console.log("Pinging client...");
      
      //ws.ping();
  
      // This is frustrating but the WebSocket API doesn't have
      // an event listener for ping events
      // You'll just have to use a message with some metadata
      // attached to it to help differentiate between regular messages
      // and ping messages
  
      ws.send(JSON.stringify({
        type: "ping",
        data: "heartbeat"
      }));
  
    });
  }
  catch(err) {
    console.error("ERROR when sending websocket messages from chat")
  }
  

}, 3000);

global.wss.on('close', function close() {
  console.log("Closing websocket server");
  clearInterval(heartbeatMonitor);
});


global.wss.on('connection', function connection(ws) {

  ws.isAlive = true;

  ws.on('error', (err) => {
    console.error(err);
  });

  // ws.on('pong', heartbeat);

  ws.on('message', (data) => {

    const bound_heartbeat = heartbeat.bind(ws);

    // bound_heartbeat();

    const msg = JSON.parse(data.toString());

    if(msg.type === "status") {
      console.log(msg.data);
    }

    if(msg.type === "data") {

      bound_heartbeat();

      global.wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "message",
            data: msg.data
          }));
        }
      });

      // Send message back to longpoll subscribers.
      Object.keys(global.subscribers).forEach(function each(id) {
        global.subscribers[id].end(JSON.stringify({
            type: "message",
            data: msg.data
        }));
      });
      
    }

    if(msg.type === "pong") {

      bound_heartbeat();

    }
    
  });

  // ws.send('Connection to Server Successful');

});

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = request.url;

  if(pathname === '/chat') {
    global.wss.handleUpgrade(request, socket, head, function done(ws) {
      global.wss.emit('connection', ws, request);
    })
  }
  else {
    socket.destroy();
  }

});

server.listen(3000, () => {
  console.log("listening on port 3000");
});

// module.exports = app;