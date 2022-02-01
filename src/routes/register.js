const express = require("express");
const {check, validationResult} = require("express-validator");
const router = express.Router();
const logger = require('../utils/logger')
const bcrypt = require("bcryptjs");
const models = require('../database/models')

router.post(
  "/register",
  [
    check("username", "Please Enter a Valid Username")
      .not()
      .isEmpty(),
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

    const {username, email, password} = req.body;

    try {
      let user = await models.User.findOne({email});

      if (user) {
        return res.status(400).json({
          msg: "User Already Exists"
        });
      }

      user = new models.User({username, email, password});

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      user.save()
        .then(() => {
          console.log(`new User saved to DB`)
          res.status(200).send("User Created successfully, please login to continue");
        })
        .catch(err => console.log(`Error while saving user to DB`, err));
    } catch (err) {
      logger.error(err);
      res.status(500).send("Server error, could not register");
    }
  }
);

module.exports = router;
