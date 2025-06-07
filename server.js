// const express = require('express');
// const { ExpressPeerServer } = require('peer');
// const app = express();

// const PORT = process.env.PORT || 9000;

// // Create express server
// const server = app.listen(PORT, () => {
//   console.log(`PeerJS server running on port ${PORT}`);
// });

// // Create PeerJS server
// const peerServer = ExpressPeerServer(server, {
//   path: '/peerjs',
//   proxied: true,
//   allow_discovery: true,
//   debug: true
// });

// // Add the PeerJS server to the Express app
// app.use('/peerjs', peerServer);

// // Add a simple route for testing
// app.get('/', (req, res) => {
//   res.send('PeerJS signaling server is running');
// });

// // PeerJS server events
// peerServer.on('connection', (client) => {
//   console.log(`Client connected: ${client.getId()}`);
// });

// peerServer.on('disconnect', (client) => {
//   console.log(`Client disconnected: ${client.getId()}`);
// });

