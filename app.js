const express=require("express");
const mongoose=require("mongoose");
const session=require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//custom
const db = require("./config/database");
const pswutil = require("./lib/pswutil");
const VerifyStrat = require("./config/strategy");
const isAuth = require("./AuhMiddleware/isauth");
const User = require("./models/Users");
const Todo = require("./models/TodoList");

const app=express();
 mongoose.connect(db.MongoURL).then(()=>{
    console.log('successfully connected');
}).catch((error)=>{
    console.log("error not connected: " , error);
});




app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use(session({
    secret:"this is my secret!!!", 
    resave:false,
    saveUninitialized:false,
    store:db.sessionStore
}));
  


 
passport.use(new LocalStrategy({
    usernameField : 'EmailUser',
    passwordField:'password',
    session:true
},VerifyStrat));

passport.serializeUser(function(User, done) {
    done(null, User.id); 
    

});


passport.deserializeUser(function(id, done) {
    User.findById(id)
        .then(function(user) {
            done(null, user);
        })
        .catch(function(err) {
            done(err, null);
        });
});



app.use(passport.initialize());
app.use(passport.session());
app.get("/",function(req,res){
    res.render("home");
})

app.get("/login" , function(req,res){
    res.render("login");
});

app.post('/login',passport.authenticate("local",{ failureRedirect: "/login" }),async function(req,res){
    try {
        await User.findOne({email:req.body.EmailUser}).then((UserRedirect)=>{
            res.redirect("/"+UserRedirect.username);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error");
    }
});

app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register" , async function(req,res){
    const un = req.body.username;
    const email = req.body.email;
    try {
        const hashedpsw = await pswutil.Generatepsw(req.body.password,10);
        const NewUser  = new User({
            username:un,
            email:email,
            hash:hashedpsw.toString()
        });
        NewUser.save();

    } catch (error) {
        res.status(500).send("error internal server");
    }


    
    res.redirect("/login");
});



app.get("/:client",isAuth, async function(req, res) {
    const UserName = req.params.client;
    try {
      const Client_List = await Todo.find({ Username: UserName });
      res.render("todolist", { DATA: Client_List, USER: UserName });
    } catch (error) {
      console.log(error);
      res.status(500).send("error internal server");
    }
  });

  app.post("/logout" , (req,res)=>{
    req.logout((err)=>{
        console.log(err);
    });
    res.redirect("/login");
  })


//   app.post("/:client" , async (req,res)=>{
//         const List_name=req.body.List_name;
//         const New_List = new Todo({
//             Username:req.params.client,
//             Name:List_name
//         });
//         await New_List.save().then(()=>{
//             res.redirect("/:client");
//         }).catch((err)=>{
//             console.log(err);
//         })
//   });


//   app.get("/:client/:list" ,isAuth , async  (req,res)=>{
//     const FoundList = await Todo.findOne({Username:req.params.client , Name:req.params.list});
//     if(FoundList){
//         return res.render("list" , {FOUNDLIST:FoundList});
//     } 
//   })


//   app.post("/:client/:list" , async (req,res)=>{
//     const Task = req.body.task;
//     if(Task!=""){
//         try {
//             await Todo.updateOne({Username:req.params.clien , Name:req.params.list} , {$push:{Tasks:Task}}).then(()=>{
//                 res.redirect("/"+req.params.client+"/"+req.params.list);
//             });
//         } catch (error) {
//             console.log(error);
//             res.status(500).send("Error internal server");
//         }    
//     }
//     return  res.redirect("/"+req.params.client+"/"+req.params.list);
//   })
  


app.listen(3000,function(req,res){
    console.log("server successfully running on port 3000");
})