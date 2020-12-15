const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config()

app.set("view engine", 'ejs');
app.use(bodyparser.urlencoded({extended:true,}));



//-------------------------------- Database --------------------------------//
mongoose.connect("mongodb://localhost:27017/userInfoDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username : String,
  password : String
});

const User = mongoose.model("User", userSchema);


//--------------------------------Register page--------------------------------//
app.get("/", function(req, res){

  User.find({},function(err, users){
    if(!err){
      res.render("register", { users: users })
    }
  })
});

app.post("/", function(req, res){
  const username = req.body.new_username;
  const password = req.body.new_password;
  const confirm_password = req.body.confirm_password;

  if(password !== confirm_password){

    console.log("error");
    res.redirect("/");

  }else {

    User.findOne({username: username}, function(err, founduser){
      if(!err){
        if(founduser){
          res.redirect("/login");
        }else{
          const user = new User({
            username : username,
            password : password
          });
          user.save(function(err){
            if(!err){
              res.render("user", { user: user });  
            }
          })
        }   
      }
    });
  }
});


//--------------------------------Detail page--------------------------------//
app.get("/user/:userID", function (req, res) {
  const requestedUserId = req.params.userID;

  User.findOne({ _id: requestedUserId }, function (err, founduser) {
    if(founduser){
      console.log(founduser)   
      res.render("user", { user: founduser });
    }else{
      res.status(404).json({ error: "No Profile Found" });
    }  
  });
});

app.post("/user/:userID", function(req, res){
  const requestedUserId = req.params.userID;

  User.findOneAndDelete({ _id: requestedUserId }, function(err){
    if(!err){
      res.redirect("/")
    }
  } )
})


//--------------------------------Login page--------------------------------//
app.get("/login", function(req, res){
  res.render("login")
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username : req.body.username,}, function(err, founduser){
    if(!err){

      if(founduser){
        if(founduser.password ===  req.body.password){
          res.redirect("user/" + founduser._id); 
        }else{
          res.redirect("login");
        }
      }
    }
  })
})


//------------------------------------------------------------------//
app.listen("3000",function(){
  console.log("Server is started in 3000");
});
