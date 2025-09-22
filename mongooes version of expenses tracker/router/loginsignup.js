const express=  require("express");
const router = express.Router();
const user= require("../models/user");
const path= require("path");
const bycrypt = require("bcrypt");
const jwttoken =require("jsonwebtoken");
const { json } = require("body-parser");
const sendResetEmail=require("../email");
const fs= require("fs");



// Reset password page (with token id)
router.get("/reset-password/:id", (req, res) => {
  const tokenId = req.params.id;

  // reset-password.html file padhna
  let filePath = path.join(__dirname, "../public/reset-password.html");
  let html = fs.readFileSync(filePath, "utf-8");

  // Placeholder replace kar dena
  html = html.replace("{{tokenId}}", tokenId);
  res.send(html);
});

// ================= POST ROUTES =================

// Reset password
router.post("/reset-password/:id", async (req, res) => {
  const { newpassword } = req.body;
  try {
    const token = req.params.id;
    const data = await user.findOne({ _id: token } );
    if (!data) {
      return res.send("Invalid reset link");
    }

    const hashpassword = await bycrypt.hash(newpassword, 10);
    data.password = hashpassword;
    await data.save();

    res.sendFile(path.join(__dirname, "../public/login.html"));
  } catch (error) {
    console.log("error while reset password", error);
    res.send("error while reset password");
  }
});



router.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/login.html"));
})
router.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/login.html"));
})
router.get("/signup",(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/signup.html"));
});
router.get("/forgetpassword",(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/forgetpassword.html"));
});




router.post("/login",async(req,res)=>{
    const{email,password}= req.body;
    try{
    const data =await user .findOne({email:email})
    if(data==null){
        return res.sendFile(path.join(__dirname,"../public/signup.html"))
    }
    let compare= await bycrypt.compare(password,data.password);
    if(!compare){
        res.sendFile(path.join(__dirname,"../public/login.html"));
    }
    const token=await jwttoken.sign({id:data._id},process.env.JWT);
    res.cookie("token",token);
    res.sendFile(path.join(__dirname,"../public/expenses.html"));
    }catch(error){
        console.log("error while login",error);
    }

})
router.post("/signup",async(req,res)=>{
    const{name,email,password}=req.body;
    try{
    let  data1=await user.findOne({email:email});
    if(data1!=null){
        return res.sendFile(path.join(__dirname,"../public/login.html"));
    }
const newpassword= await bycrypt.hash(password,10);
    const data =user({name:name,email:email,password:newpassword});
    await data.save();
    console.log("user is added sucesfully");
    data1=await user.findOne({email:email});
let token=jwttoken.sign({id:data1._id},process.env.JWT);
res.cookie("token",token);
res.sendFile(path.join(__dirname,"../public/expenses.html"));


    }catch(err){
        console.log("error while entring new user",err);
    }
})
router.post("/forgetpassword", async (req, res) => {
  const { email } = req.body;
  try {
    const data = await user.findOne( { email: email } );
    if (data ==null) {
      return res.sendFile(path.join(__dirname, "../public/signup.html"));
    }

    const id = data._id;
    const link = `https://zvpdx0xj-3000.inc1.devtunnels.ms/reset-password/${id}`; // devtunnel ke jagah localhost use kar
    await sendResetEmail(email, link);

    res.sendFile(path.join(__dirname, "../public/login.html"));
  } catch (error) {
    console.log("error while sending resetlink to user", error);
    res.send("Something went wrong");
  }
});

module.exports=router;