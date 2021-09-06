const express = require("express")
const path= require("path")
const hbs=require("hbs")
const bcrypt = require("bcryptjs")
const app = express()
require("./db/conn")
const Register = require("./models/registers.js")

const port = process.env.PORT || 3000
const staticpath= path.join(__dirname,"../public")
const viewpath = path.join(__dirname,"../templates/views")
const partialpath = path.join(__dirname,"../templates/partials")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(express.static(staticpath))
app.set("view engine","hbs")
app.set("views" ,viewpath)
hbs.registerPartials(partialpath)

app.get("/", (req,res) => {
    res.render("index")
})
 app.get("/register" ,(req,res) =>{
    res.render("register")
})

app.post("/register" , async(req,res) =>{
   try{
      // console.log(req.body.firstname)
       const password = req.body.password
       const cpassword = req.body.confirmpassword
       if(password === cpassword){
      // console.log(req.body.password)
       //console.log(req.body.confirmpassword)
       const registerEmployee = new Register({
               firstname: req.body.firstname,
               lastname:req.body.lastname,
               phone : req.body.phone,
               email:req.body.email,
               age:req.body.age,
               gender : req.body.gender,
               phone : req.body.phone,
               password:req.body.password,
               confirmpassword:req.body.confirmpassword,
               tokens:req.body.token
        })
        
        console.log("success part "+registerEmployee); 
       const token = await registerEmployee.generateAuthToken()
       console.log("token part ",token);
       
       const registered = await registerEmployee.save()
       res.status(201).render("index")
       }
    else{
           res.send("password are not matching")
       }
   }catch(error){
   res.status(400).send(error)
   console.log("error part is ",error);
   
   }
   
})


app.get("/login" ,(req,res) =>{
    res.render("login")
})


app.post("/login",async(req,res) =>{
    try {
        const email= req.body.email
        const password = req.body.password
        const useremail = await Register.findOne({email:email})
       
        const isMatch = await bcrypt.compare(password , useremail.password)
       
        const token = await useremail.generateAuthToken()

        console.log("token part is",token);
        
       if(isMatch){
           res.status(201).render("index")
       }else{
           res.send("password are not matching")
       }
    } catch (error) {
        res.status(400).send("invalid email")
    }
})


//  const securePassword = async(password) =>{
//     const passwordHash = await bcrypt.hash(password,10)
//      console.log(passwordHash)
//      const passwordMatch = await bcrypt.compare(password,passwordHash)
//      console.log(passwordMatch)
//  }
//  securePassword("1234")

/*
//create token in general
const jwt = require("jsonwebtoken")
const createToken = async() =>{
   const token = await jwt.sign({_id:"612d9bbd76d6b0b2f87d6a8a"} ,"mynameispriyankawadleudgirlaturt",{
       expiresIn:"2 seconds"
   })
   console.log(token);
   const userver = await jwt.verify(token,"mynameispriyankawadleudgirlaturt")
   console.log(userver);
   
}
createToken()
*/
app.listen(port,() =>{
    console.log("listening port number ",port)
})


