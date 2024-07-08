let jwt = require("jsonwebtoken");



module.exports =  (req, res, next)  => {
  try {
    let token = req.headers.authorization.split("Bearer ")[1];
    let decoded = jwt.verify(token, process.env.JWT_KEY);
    req.auth = decoded;
    console.log(decoded);
    return next();
    }
    catch (error) {
      return res.status(401).send({
        status: 401,
        massage: "unauthorized",
      });
    }
};

module.exports.adminRequired = async (req, res, next) => {
    try {
      let token = req.headers.authorization.split("Bearer ")[1];
      let decoded = jwt.verify(token, process.env.JWT_KEY);
      req.auth = decoded;
  
      const user = await require("../models/user.model").findById(decoded.userId);
      if (!user || !user.isadmin) {
        return res.status(403).send({
          status: 403,
          message: "Admin access required",
        });
      }
  
      return next();
    } catch (error) {
      return res.status(401).send({
        status: 401,
        message: "unauthorized",
      });
    }
  };
