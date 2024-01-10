export default () => ({
  provider: process.env.PROVIDER,
  port: parseInt(process.env.PORT, 10) || 3000,
  swaggerEnable: process.env.SWAGGER_ENABLE || '0',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_DB || 0,
  },
})
