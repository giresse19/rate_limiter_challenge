
module.exports = async (req, res, next, callback) => {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) return void callback({status: 403, message: "Forbidden request"});
  const bearer = bearerHeader.split(' ');
  req.token = bearer[1]
  next();
};
