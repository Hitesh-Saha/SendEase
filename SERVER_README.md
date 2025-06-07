# SendEase PeerJS Signaling Server

This document provides instructions for setting up and running the PeerJS signaling server for SendEase.

## Overview

SendEase uses PeerJS for peer-to-peer file transfers. While PeerJS can work without a dedicated signaling server, having one improves connection reliability, especially in environments with NAT or firewalls.

## Running the Server

### Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the PeerJS server:
   ```
   npm run server
   ```

3. In a separate terminal, start the application:
   ```
   npm run dev
   ```

4. The PeerJS server will run on port 9000 by default, and the application will connect to it automatically when running locally.

### Production Deployment

For production deployment, you have several options:

1. **Deploy on the same server as your application**:
   - Configure your web server (Nginx, Apache, etc.) to proxy requests to the PeerJS server.
   - Update SSL configuration in `server.js` with your actual certificate files.

2. **Deploy as a separate service**:
   - Deploy the PeerJS server on a separate server or service.
   - Update the PeerJS configuration in the application to point to your server.

## Configuration

### Server Configuration

The PeerJS server configuration is in `server.js`. You can modify the following options:

- `port`: The port the server will listen on (default: 9000 or the value of the PORT environment variable)
- `path`: The path for the PeerJS server (default: '/peerjs')
- `allow_discovery`: Whether to allow peer discovery (default: true)
- `debug`: Whether to enable debug logging (default: true)
- `ssl`: SSL configuration for secure connections

### Client Configuration

The client configuration is in the `initializeSender` and `initializeReciever` functions in the Sender and Receiver components. The configuration automatically detects whether the application is running locally or in production and adjusts the connection parameters accordingly.

## Troubleshooting

### Connection Issues

If you experience connection issues:

1. Check that the PeerJS server is running.
2. Verify that the client configuration matches the server configuration (host, port, path).
3. Check browser console for error messages.
4. Ensure that the required ports are open in your firewall.

### SSL Issues

For production deployments with HTTPS:

1. Ensure that you have valid SSL certificates.
2. Update the SSL configuration in `server.js` with your certificate files.
3. Set the `secure` option to `true` in the client configuration.

## Additional Resources

- [PeerJS Documentation](https://peerjs.com/docs.html)
- [PeerJS Server GitHub Repository](https://github.com/peers/peerjs-server)