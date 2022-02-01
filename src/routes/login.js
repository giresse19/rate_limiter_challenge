const express = require("express");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();
const logger = require('../utils/logger');
const bcrypt = require("bcryptjs");
const models = require('../database/models');

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {email, password} = req.body;

    try {
      let user = await models.User.findOne({email});

      if (!user) {
        return res.status(400).json({
          message: "User Not Exist"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Incorrect Password !"
        });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;

          res.status(200).json({
            token
          });
        }
      );
    } catch
      (e) {
      logger.error(e);
      res.status(500).json({
        message: "Server Error, could not login"
      });
    }
  }
)
;

module.exports = router
