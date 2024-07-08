var express = require("express");
var router = express.Router();
var orderSchema = require("../models/orders.model");
var verifyToken = require("../middleware/jwt_decode");

/* GET home page. */
router.get("/", verifyToken, verifyToken.adminRequired,  async function (req, res, next) {
  try {
    let orders = await orderSchema.find();
    res.status(200).send({
      status: 200,
      massage: "success",
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      massage: "error",
    });
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    let { id } = req.params;

    let orders = await orderSchema.findById(id);
    res.status(200).send({
      status: 200,
      massage: "success",
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      massage: "error",
    });
  }
});

router.post("/", async function (req, res, next) {
  try {
    let { name, quantity, productid } = req.body;

    let orders = new orderSchema({ name, quantity, productid });

    await orders.save({ name, quantity, productid });
    res.status(200).send({
      status: 200,
      massage: "success",
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      massage: "error",
    });
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    let { id } = req.params;

    let order = await orderSchema.findById(id);
    if (!order) {
      return res.status(400).send({
        status: 400,
        massage: "order not found",
      });
    }

    let { name, quantity, productid } = req.body;
    order.name = name;
    order.quantity = quantity;
    order.productid = productid;
    await order.save();

    res.status(200).send({
      status: 200,
      massage: "order updated",
      data: orders,
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
