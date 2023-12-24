const mongoose =  require('mongoose');


const recipeSchema = mongoose.Schema({
    // id:{type:Number, required:true},
    title:{type:String, required:true},
    ingredients: [{type:String, required:true}],
    instructions: [{type:String, required:true}],
    thumbnail:{type:String},
    isVeg: {type:Boolean, required:true},
    time: {type:String, required:true},
})
const recipes = mongoose.model("recipes", recipeSchema);
module.exports = recipes;