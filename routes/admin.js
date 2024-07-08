var express = require("express");
var router = express.Router();
var userSchema = require("../models/user.model");
var verifyToken = require("../middleware/jwt_decode");


router.put("/approve/:id", verifyToken, verifyToken.adminRequired, async function (req, res, next) {
    try {
      let { id } = req.params;
  
      let user = await userSchema.findById(id);
      if (!user) {
        return res.status(401).send({
          status: 401,
          massage: "user not found",
        });
      }
  
      user.Approved = true;
      await user.save();
  
      res.status(200).send({
        status: 200,
        massage: "user approved",
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        massage: "error",
      });
    }
  });

module.exports = router;