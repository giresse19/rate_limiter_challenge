const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, "..", `.env.${process.env.NODE_ENV}`),
  override: true,
  debug: true
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8000,
  HOST: process.env.host || 'localhost',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://mongo:27017/outvioApp',
  MAX_WINDOW_REQUEST_COUNT: process.env.MAX_WINDOW_REQUEST_COUNT || 100,
  REDIS_URI: process.env.REDIS_URI || 'redis://redis:6379',
  WINDOW_SIZE_IN_HOURS: process.env.WINDOW_SIZE_IN_HOURS || 1,
  WINDOW_LOG_INTERVAL_IN_MINUTES: process.env.WINDOW_LOG_INTERVAL_IN_MINUTES || 5,
  THRESHOLD_NUMBER_TO_ALERT: process.env.THRESHOLD_NUMBER_TO_ALERT || 5,
  RETRY_DURATION_IN_MINUTES:  process.env.RETRY_DURATION_IN_MINUTES || 60,
  SECONDS: process.env.SECONDS || 60,
  REDIS_HOST: process.env.REDIS_HOST || 'redis',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
}
