const mongoose = require("mongoose");
const userDB = require("../model/user");

async function registerUser(userData) {
  try {
    let obj = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      recentViews: [],
      myRecipes: [],
      favorite: [],
    };
    let isExsit = await userDB.findOne({ email: obj.email });
    if (isExsit == null) {
      let resposnse = await userDB.create(obj);
      return true;
    } else {
      return 'user exist'
    }
  } catch (error) {
    return false;
  }
}
async function loginUser(data){
 let  user =   await  userDB.findOne({email:data.email});
if(user == null){
    return {message : 'user not Registered, please Register'}
}
if(user.email == data.email && user.password == data.password){
 return {message : 'login successfull'  , data:user};
}
else{
    return {message  : 'Invalid username and password' }
}

}
async function updateRecent(data){
    let result  = await  userDB.findOneAndUpdate({email:data.email}, {$push:{recent:data.recipe}}, { new: true })
    return result?'success':'failed';
}
module.exports = { registerUser, loginUser , updateRecent};
