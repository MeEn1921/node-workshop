var express = require("express");
var router = express.Router();
var userSchema = require("../models/user.model");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var verifyToken = require("../middleware/jwt_decode");


router.get("/", verifyToken, async function (req, res, next) {
  try {
    let user = await userSchema.find();
    res.send({
      status: 200,
      massage: "success",
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

// router.post("/login", async function (req, res, next) {
//   try {
//     let { name, password } = req.body;

//     let user = await userSchema.findOne({ name });
//     if (!user) {
//       return res.status(400).send({
//         status: 400,
//         massage: "cannot find user please register first",
//       });
//     }
//     if (!bcrypt.compareSync(password, user.password)) {
//       return res.status(400).send({
//         status: 400,
//         massage: "wrong password",
//       });
//     }
//     if (user.Approved === false) {
//       return res.status(401).send({
//         status: 401,
//         massage: "user not approved",
//       });
//     }

//     let token = jwt.sign(
//       { userId: user._id, isAdmin: user.isAdmin },
//       process.env.JWT_KEY,
//       { expiresIn: "1h" }
//     );
//     console.log(token);

//     console.log(user);
//     res.status(200).send({
//       status: 200,
//       massage: "success",
//       token: token,
//       data: user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       status: 500,
//       massage: "error",
//     });
//   }
// });

router.post("/login", async function (req, res, next) {
  try {
    let { name, password } = req.body;

    let user = await userSchema.findOne({ name });
    if (!user) {
      return res.status(400).send({
        status: 400,
        message: "Cannot find user. Please register first",
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        status: 400,
        message: "Wrong password",
      });
    }
    if (user.Approved === false) {
      return res.status(401).send({
        status: 401,
        message: "User not approved",
      });
    }

    let token = jwt.sign(
      { userId: user._id, isadmin: user.isadmin },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    console.log(token);
    console.log(user);

    // แยกการตอบกลับสำหรับผู้ใช้ปกติและผู้ดูแลระบบ
    if (user.isadmin) {
      res.status(200).send({
        status: 200,
        message: "Admin login successful",
        token: token,
        data: user,
      });
    } else {
      res.status(200).send({
        status: 200,
        message: "User login successful",
        token: token,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
});

router.post("/register", async function (req, res, next) {
  try {
    let { name, password, email } = req.body;
    let hashpassword = bcrypt.hashSync(password, 10);

    let user = new userSchema({ name, password: hashpassword, email });

    await user.save({ name, password: hashpassword, email });
    res.status(200).send({
      status: 200,
      massage: "success",
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
