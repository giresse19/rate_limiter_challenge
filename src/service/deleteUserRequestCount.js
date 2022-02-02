const redisClient = require('../utils/initRedis');
const logger = require('../utils/logger');

const deleteWithIpAsKey = (req, res, callback) => {
  try {
    redisClient.del(req.ip, (err, record) => {
      if (err) logger.error("Error while deleting user request count: ", err);
      callback(null, record)
    })
  } catch (e) {
    logger.error("Error: ", e);
    callback({status: 400, message: "Error while deleting user request count"})
  }

}

const deleteWithIpAndTokenAsKey = (req, res, callback) => {
  let key = req.token ? req.token + req.ip : req.ip
  try {
    redisClient.del(key, (err, record) => {
      if (err) logger.error("Error while deleting user request count: ", err);
      callback(null, record)
    })
  } catch (e) {
    logger.error("Error: ", e);
    callback({status: 400, message: "Error while deleting user request count"})
  }

}




module.exports = {deleteWithIpAsKey, deleteWithIpAndTokenAsKey}
