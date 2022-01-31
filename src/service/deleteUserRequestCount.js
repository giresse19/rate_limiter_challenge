const redisClient = require('../utils/initRedis');
const logger = require('../utils/logger');

module.exports = (req, res, callback) => {
  try {
    redisClient.del(req.ip, (err, record) => {
      if (err) logger.error("Error while deleting user record: ", err);
      callback(null, record)
    })
  } catch (e) {
    logger.error("Error: ", e);
  }

}
