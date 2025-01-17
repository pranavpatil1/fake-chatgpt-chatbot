const { createServer }  = require('http');
const express = require('express');
const WebSocket=require('ws');
const app=express();
app.use(express.json({ extended: false}));
app.use(express.static('public'));

var port = process.env.PORT || 3000;
const server=new WebSocket.Server({ server:app.listen(port) });

server.on('connection', (socket) => {
  console.log('connection started')

  socket.on('message', (msg) => {
    console.log('received message: "' + msg + '"')
    server.clients.forEach( client => {
      client.send(msg);
    })
  });
});