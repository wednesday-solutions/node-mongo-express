import bunyan from 'bunyan';

module.exports = global.log = bunyan.createLogger({
  name: 'myapp',
  streams: [
    {
      level: 'info',
      stream: process.stdout,
    },
  ],
});
