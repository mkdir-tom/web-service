import { TCP_USER_SERVICE } from '../constants'

export default () => ({
  provider: process.env.PROVIDER,
  port: parseInt(process.env.PORT, 10) || 3000,
  swaggerEnable: process.env.SWAGGER_ENABLE || '0',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_DB || 0,
  },
  authentication: {
    hashSize: 10,
    secret: process.env.SECRET_KEY || 'limited',
    jwtOptions: {
      header: { type: 'access' },
      issuer: 'master',
      algorithm: 'HS256',
      expiresIn: '7d',
    },
  },
  microservice: {
    [TCP_USER_SERVICE]: {
      host: process.env.USER_SERVICE_HOST || 'user-service',
      port: parseInt(process.env.USER_SERVICE_PORT, 10) || 3001,
    },
    // [TCP_USER_SERVICE]: {
    //   host: process.env.USER_SERVICE_HOST || 'user-service',
    //   port: parseInt(process.env.USER_SERVICE_PORT, 10) || 3001,
    // },
  },
})
