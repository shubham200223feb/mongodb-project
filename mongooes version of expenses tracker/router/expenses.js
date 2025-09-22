const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const jwttoken = require("jsonwebtoken");
const path = require("path");
const fs= require("fs");

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token" });

    
    const decoded = jwttoken.verify(token, process.env.JWT);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });


    req.user = user;
    next();
  } catch (err) {
    console.log("Error while authenticating the user:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

router.post("/add",isAuth,async(req,res)=>{
    const{item,amount,category,description}=req.body;
    try{
    const data= Product({item:item,amount:Number(amount),category:category,description:description,user_id:req.user._id});
    let user=await User.findById(req.user._id);
    user.total+=Number(amount);
    await user.save();
    await data.save();
    res.redirect("/app")

    }catch(err){
        console.log("error in insert product  in data base",err)
    }
})
router.get("/app",(req,res)=>{
  res.sendFile(path.join(__dirname,"../public/expenses.html"));
})
router.get("/expencess", isAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const offset = (page - 1) * limit;
const userId = req.user._id; // Mongoose me id _id hoti hai
const filter = { user_id: userId }; // schema me tumne user_id rakha hai

// 1. Count total documents
const count = await Product.countDocuments(filter);

// 2. Fetch paginated + sorted documents
const expenses = await Product.find(filter)
  .skip(offset)
  .limit(limit);




    const totalPages = Math.ceil(count / limit);

    res.json({
      expenses,
      key_id: process.env.RAZORPAY_KEY_ID,
      userId,
      isPremium: req.user.isPremium,
      currentPage: page,
      totalPages,
      limit,
    });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/feachdata",isAuth,async(req,res)=>{
  try{
const data =await User.find();
console.log("feaching data for leaderbord");
res.json(data);
  }catch(err){
console.log("eeror while feching data for leaderbord",err);
  }
})
router.post("/delete",isAuth,async(req,res)=>{
  const{userid,amount,expencesid}=req.body;
  try{
const addamount= await User.findById(userid);
addamount.total-=Number(amount);
await addamount.save();
const prod= await Product.deleteOne({_id:expencesid});
res.redirect("/app");
  }catch(err){
console.log("error while deleting elemnt from dtaabse",err);
  }
})
router.get("/download",isAuth,async(req,res)=>{
try{
const data = await Product.find( { user_id: req.user.id } );

    const dataexpencess = req.user.name + Date.now() + ".txt";
    let filedata = "Item,Amount,Category,Description\n";

    data.forEach(exp => {
      filedata += `${exp.item},${exp.amount},${exp.category},${exp.description || ""}\n`;
    });

    fs.writeFileSync("Server.txt", filedata);

    res.download("Server.txt", dataexpencess);
}catch(err){

}
})
module.exports =  router ;
