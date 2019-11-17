// eslint-disable-next-line no-unused-vars
import { Server } from 'socket.io';

let socketId;
const connectedUsers = {};

/**
 * @param {Server} io
 */
export default io => {
  io.on('connection', socket => {
    socketId = socket.id;
    connectedUsers[socket.id] = true;

    socket.on('disconnect', () => {
      if (connectedUsers[socket.id]) {
        delete connectedUsers[socket.id];
      }
    });

    io.sockets.emit('connectedUsers', connectedUsers);
  });

  return (req, res, next) => {
    req.io = io;
    req.socketId = socketId;
    req.connectedUsers = connectedUsers;

    return next();
  };
};
