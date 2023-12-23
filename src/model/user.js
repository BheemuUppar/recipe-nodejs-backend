const mongoose =  require('mongoose');


const userSchema = mongoose.Schema({
    name:{type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    recent: [{type:Object}],
    myRecipes: [{type:Object}],
    favorite: [{type:Object}],

})
const users = mongoose.model("users", userSchema);
module.exports = users;