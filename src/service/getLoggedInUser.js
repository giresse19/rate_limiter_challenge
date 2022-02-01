const models = require('../database/models');
const logger = require('../utils/logger');

module.exports = async (req, res, callback) => {
  try {
    const user = await models.User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    logger.error("Error in Fetching user: ", e);
    callback({status: 400, message: "Error in Fetching user"})
  }
}
