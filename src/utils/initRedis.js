const redis = require('redis')
const logger = require('./logger')
const config = require('../config')

const redisClient = redis.createClient({host: config.REDIS_HOST, port: config.REDIS_PORT});

redisClient.on('connect', () => {
  logger.info('redisClient connected to redis...')
})

redisClient.on('ready', () => {
  logger.info('redisClient connected to redis and ready to use...')
})

redisClient.on('error', (err) => {
  logger.error(err.message)
})

redisClient.on('end', () => {
  logger.warn('redisClient disconnected from redis')
})

process.on('SIGINT', () => {
  redisClient.quit()
})

module.exports = redisClient
