module.exports = Util;

function Util(argv, io) {
  this.argv = argv;
  this.io = io;
}

Util.prototype.socketSend = function(socket, message) {
  if (!this.argv.nosocks) {
    this.io.sockets.emit(socket, message);
  }
};

Util.prototype.debug = function(message) {
  if (this.argv.debug) {
    console.log(message);
  }
};

Util.prototype.sendConnectMetrics = function(metrics) {
  if (!this.argv.nosocks) {
    this.io.sockets.on('connection', function(socket) {
      socket.emit('metrics', metrics);
    });
  }
}
