const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const employeeSchema = new mongoose.Schema({
    firstname :{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true,
       
    },
    confirmpassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

//generate token
employeeSchema.methods.generateAuthToken = async function(){
 try{
    const token = jwt.sign({_id:this._id.toString()},"mynameispriyankawadleudgirlaturt")
    this.tokens = this.tokens.concat({token:token})
    await this.save()
    return token
}catch(error){
    res.send("error is ", error)
    console.log("error is ",error)
 }

}
//encryption of password
employeeSchema.pre("save",async function(next){
    try{
    if(this.isModified("password")){
     this.password = await bcrypt.hash(this.password,6)
     this.confirmpassword = await bcrypt.hash(this.confirmpassword,10)
    }
    next()
   }
   catch(e){
       console.log("erroe is ", e)
   }
})

const Register = new mongoose.model("Register",employeeSchema)

module.exports = Register



