const express = require("express");
const Razorpay = require("razorpay");
const Order = require("../models/order");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const e = require("express");
const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Middleware
const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT);
    const user = await User.findById(decoded.id);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Create Order
router.post("/create/order", isAuth, async (req, res) => {
  try {
    const amount = 25000; // ₹250
    const order = await razorpayInstance.orders.create({
      amount,
      currency: "INR",
    });

    const  orderindataabse= Order({
      order_id: order.id,
      status: "PENDING",
      user_id: req.user._id,
    });
await orderindataabse.save();
    res.json({ order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
});

// Update Order
router.post ("/update/order-status", isAuth, async (req, res) => {
  const { order_id, payment_id } = req.body;
  console.log(req.body);
  try{
    console.log("hii");
    const order = await Order.findOne( { order_id: order_id } );
    console.log(order);
  if (!order) return res.status(404).json({ error: "Order not found" });
console.log("shubham1");
  order.payment_id = payment_id;
  order.status = "SUCCESS";
  console.log("shubham2");
  await order.save();
console.log("shubham3");
  req.user.isPremium = true;
  await req.user.save();
console.log("shubham4")
  const token = await jwt.sign({id: req.user.id }, process.env.JWT);
  res.cookie("token", token);
console.log("shubham5")
  res.json({ success: true });


  }catch(err){
console.log("erro on updateing ",err);
  }
});

module.exports = router;
