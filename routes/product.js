var express = require("express");
var router = express.Router();
var productSchema = require("../models/product.model");
var orderSchema = require("../models/orders.model");
var verifyToken = require("../middleware/jwt_decode");


/* GET home page. */
router.get("/",verifyToken , async function (req, res, next) {
  try {
    let product = await productSchema.find();
    res.send({
      status: 200,
      massage: "success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      massage: "error",
    });
  }
});

router.get("/:id", verifyToken, async function (req, res, next) {
  try {
    let { id } = req.params;

    let product = await productSchema.findById(id);
    res.send({
      status: 200,
      massage: "success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      massage: "error",
    });
  }
});

router.post("/", verifyToken, verifyToken.adminRequired,async function (req, res, next) {
  try {
    let { name, price, quantity } = req.body;

    let product = new productSchema({ name, price, quantity });

    await product.save({ name, price, quantity });
    res.send({
      status: 200,
      massage: "success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      massage: "error",
    });
  }
});

router.put("/:id", verifyToken, verifyToken.adminRequired, async function (req, res, next) {
  try {
    let { id } = req.params;

    let product = await productSchema.findById(id);
    if (!product) {
      return res.status(400).send({
        status: 400,
        massage: "cannot find product",
      });
    }

    let { name, price, quantity } = req.body;
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;
    await product.save();

    res.status(200).send({
      status: 200,
      massage: "success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      massage: "error",
    });
  }
});

router.delete("/:id", verifyToken, verifyToken.adminRequired, async function (req, res, next) {
  try {
    let { id } = req.params;

    let product = await productSchema.findByIdAndDelete(id);
    if (!product) {
      return res.status(400).send({
        status: 400,
        massage: "cannot find product",
      });
    }
    res.status(200).send({
      status: 200,
      massage: "success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      massage: "error",
    });
  }
});

router.get("/:id/orders", verifyToken, async function (req, res, next) {
  try {
    let productid = req.params.id;
    let product = await productSchema.findById(productid);

    let orders = await orderSchema.find({ productid: req.params.id });
    if (orders.length > 0) {
      res.json({
        status: 200,
        massage: "success",
        data: orders,
      });
    } else {
      res.status(400).send({
        status: 400,
        massage: "cannot find order",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      massage: "error",
    });
  }
});

router.post("/:id/orders", verifyToken, async function (req, res, next) {
  try {
    let productid = req.params.id;
    let product = await productSchema.findById(productid);

    let { name, quantity } = req.body;

    let orders = new orderSchema({ name, quantity, productid, productname: product.name});
    // let order = await orderSchema.findById(orders._id).populate('productid');

    if (quantity > product.quantity) {
      return res.status(400).send({
        status: 400,
        massage: "quantity not enough",
      });
    }
    await orders.save();
    product.quantity = product.quantity - quantity;
    await product.save();

    res.send({
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
module.exports = router;
