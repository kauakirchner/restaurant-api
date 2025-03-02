import pino from 'pino'

export default pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  enabled: true,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
})
