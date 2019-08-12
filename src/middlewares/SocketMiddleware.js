/**
 * @param {SocketIO.Server} socketIo
 */
export default socketIo => {
  socketIo.on('connection', client => {
    // console.log(`Socket connection: ${client.id}`);

    client.on('disconnect', () => {
      // onsole.log(`Socket disconnect: ${client.id}`);
    });
  });

  return (req, res, next) => {
    req.socketIo = socketIo;
    next();
  };
};
