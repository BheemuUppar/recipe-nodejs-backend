const mongoose =  require('mongoose');


const recipeSchema = mongoose.Schema({
    title:{type:String, required:true},
    // email: {type:String, required:true},
    // password: {type:String, required:true},
    ingredients: [{type:String, required:true}],
    instructions: [{type:String, required:true}],
    thumbnail:{type:String},
    isVeg: {type:Boolean, required:true},
    time: {type:String, required:true},
    // myRecipes: [{type:Object}],
    // favorite: [{type:Object}],

})
const recipes = mongoose.model("recipes", recipeSchema);
module.exports = recipes;