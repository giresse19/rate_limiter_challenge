const config = require('../config');
const moment = require('moment');
const logger = require('../utils/logger');
const redisClient = require('../utils/initRedis');

const getKey = (req) => {
  return req.token ? req.token + req.ip : req.ip
}

const getRetryAfter = (requestTimeStamp) => requestTimeStamp + parseInt(config.SECONDS) * parseInt(config.RETRY_DURATION_IN_MINUTES);

const rateLimitReached = (envRequestLimit, lastRequestLog, totalWindowRequestsCount, res, callback) => {
  if (totalWindowRequestsCount >= envRequestLimit) {
    res.setHeader('Retry-After', getRetryAfter(lastRequestLog.requestTimeStamp));
    return void callback({status: 429, message: `You have exceeded the ${config.MAX_WINDOW_REQUEST_COUNT} requests in ${config.WINDOW_SIZE_IN_HOURS} hr limit!`})
  }
}

const creatRecordIfNone = (existingRecord, req, currentRequestTime, next) => {
  if (existingRecord === null) {

    let newRecord = [];
    let requestLog = {
      requestTimeStamp: currentRequestTime.unix(),
      requestCount: 1
    };

    newRecord.push(requestLog);
    redisClient.set(getKey(req), JSON.stringify(newRecord));
    next();
  }
}

// For insights into user behavior and to alert of possible malicious attacks.
const alertPossibleDdosAttack = (envRequestLimit, totalWindowRequestsCount, req) => {
  if (totalWindowRequestsCount >= envRequestLimit - parseInt(config.THRESHOLD_NUMBER_TO_ALERT)) {
    logger.warn(`User with key: ${getKey(req)} seems to be reaching limit quickly, check user activity.`
    );
  }
}

module.exports = async (req, res, next, callback) => {

    try {
    redisClient.get(getKey(req), async(err, record) => {

      if (err) logger.error('Error getting user record: ', err);

      const currentRequestTime = moment();
      creatRecordIfNone(record, req, currentRequestTime, next);

      if (record !== null) {
        let userRecord = JSON.parse(record);
        let windowStartTimestamp = moment().subtract(parseInt(config.WINDOW_SIZE_IN_HOURS), 'h').unix();
        let requestsWithinWindow = userRecord.filter(entry => entry.requestTimeStamp > windowStartTimestamp);

        let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
          return accumulator + entry.requestCount;
        }, 0);

        let lastRequestLog = userRecord[userRecord.length - 1];
        rateLimitReached(parseInt(config.MAX_WINDOW_REQUEST_COUNT), lastRequestLog, totalWindowRequestsCount, res, callback);

        let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
          .subtract(parseInt(config.WINDOW_LOG_INTERVAL_IN_MINUTES), 'm')
          .unix();

        // To prevent new record creation upon every request.
        if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
          lastRequestLog.requestCount++;
          userRecord[userRecord.length - 1] = lastRequestLog;
          alertPossibleDdosAttack(parseInt(config.MAX_WINDOW_REQUEST_COUNT), totalWindowRequestsCount, req);
        } else {
          userRecord.push({
            requestTimeStamp: currentRequestTime.unix(),
            requestCount: 1
          });
        }

        redisClient.set(getKey(req), JSON.stringify(userRecord));
        next();
      }
    })
  } catch (error) {
    next(error);
  }

};

