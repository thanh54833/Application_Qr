const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost/myDatabase");

const userSchema=new mongoose.Schema({
  usr:String,
  pwd:String
});
const user=mongoose.model("use",userSchema);
user.find((err,user)=>{
console.log("Database : "+user.usr);
})


const dt=user.find().exec((err,user)=>{

 console.log("usr  :"+user);
 const dataRecord=user.find(user=>{
   
   console.log("record : "+user.usr);

 })

 
});



