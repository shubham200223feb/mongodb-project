require("dotenv").config();
const express=require("express");
const app = express();
const mongoose= require("mongoose");
const adduser= require("./router/loginsignup");
const cookie=require("cookie-parser");
const expenses= require("./router/expenses");
const razorpay=require("./router/razorpay");


const port=3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookie());
app.use(adduser);
app.use(expenses);
app.use(razorpay);
mongoose.connect("mongodb+srv://shubhamexpenses:LJ9YxKmeeGiOwx7x@cluster0.fgu9rgz.mongodb.net/expenes?retryWrites=true&w=majority&appName=Cluster0").then(result=>{
    app.listen(port,()=>{
        console.log("server is listeing at port 3000")
    })
}).catch(err=>{
    console.log("error while connecting with database",err);
});
