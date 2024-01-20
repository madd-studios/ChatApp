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
import { WebSocketServer } from 'ws';
import morgan from 'morgan';
import { router as indexRouter }  from './routes/index.js';
import { router as usersRouter } from './routes/users.js';
import { fileURLToPath } from 'url';

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

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', function connection(ws) {

  ws.on('error', (err) => {
    console.error(err);
  });

  ws.on('message', (data) => {
    console.log(`Received message: ${data}`);
  });

  ws.send('Connection to Server Successful');

});

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = request.url;

  if(pathname === '/chat') {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
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
