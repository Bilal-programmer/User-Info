const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config()

app.use(bodyparser.urlencoded({extended:true,}));

app.set("view engine", 'ejs');

//-------------------------------- Database --------------------------------//
mongoose.connect("mongodb://localhost:27017/userInfoDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username : String,
  password : String
});

const User = mongoose.model("User", userSchema);


//--------------------------------Register page--------------------------------//
app.get("/", function(req, res){
  res.render("register");
});

app.post("/", function(req, res){
  const username = req.body.new_username;
  const password = req.body.new_password;
  const confirm_password = req.body.confirm_password;


  if(password !== confirm_password){
    console.log("error");
    res.redirect("/");
  }else {

    const user = new User({
      username : username,
      password : password
    });
    user.save(function(err){
      if(!err){
          res.render("/detail", { username : username });  
      }
    });   
  }
});


//--------------------------------Detail page--------------------------------//
app.get("/detail", function(req, res){
  res.render("detail", { username : username })
});


//--------------------------------Login page--------------------------------//
app.get("/login", function(req, res){
  res.render("login")
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  console.log

  User.findOne({username : req.body.username}, function(err, founduser){
    if(!err){

      if(founduser){
        console.log(founduser)
        if(founduser.password ===  req.body.password){
          console.log(founduser)
          res.sendFile(__dirname + "/detail", { username : username });
        }else{
          res.redirect("/login");
        }
        res.render("/")
      }
    }
  })
})


//------------------------------------------------------------------//
app.listen("3000",function(){
  console.log("Server is started in 3000");
});
