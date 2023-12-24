const environment = require("../env");
// const util = require('util');
const axios = require("axios");
const url = require("url");
const userDB = require("../model/user");
const recipeDB = require("../model/recipe");
const mongoose = require("mongoose");

async function fetchRandomRecipes() {
  try {
    let apiResponse = await axios.get(
      environment.environment.randomRecipesUrl,
      environment.environment.headers1
    );
    return apiResponse.data;
  } catch (error) {
    throw error; // Optionally re-throw the error for higher-level handling
  }
}

async function searchRecipes(query) {
  try {
    let url = environment.environment.searchrecipe + query;
    let apiResponse = await axios.get(url, environment.environment.headers1);
    return apiResponse.data;
  } catch (error) {
    throw error;
  }
}

async function getRecipeById(id) {
  try {
    var recipe = await recipeDB.findOne({ _id: id });
    return recipe;
  } catch (error) {
    try {
      if (!recipe) {
        let url =
          "https://api.spoonacular.com/recipes/" +
          id +
          "/information?apiKey=" +
          environment.spoonacularApiKey;
        let apiResponse = await axios.get(
          url,
          environment.environment.headers1
        );
        console.log(apiResponse.data.id)
        let ids = apiResponse.data.id;
        let title = apiResponse.data.title;
        let ingredients = [];
        for (let j = 0; j < apiResponse.data.extendedIngredients.length; j++) {
          ingredients.push(apiResponse.data.extendedIngredients[j].original);
        }
        let isVeg = apiResponse.data?.vegan;
        let thumbnail = apiResponse.data?.image;
        let instructions = [];
        for (
          let k = 0;
          k < apiResponse.data?.analyzedInstructions[0].steps.length;
          k++
        ) {
          instructions.push(
            apiResponse.data?.analyzedInstructions[0].steps[k].step
          );
        }
        let time = apiResponse.data.readyInMinutes;
        // recipe = new Recipe(ids , title, ingredients, instructions, thumbnail , isVeg , time )
        recipe = {
          id: id,
          title: title,
          ingredients: ingredients,
          instructions: instructions,
          thumbnail: thumbnail,
          isVeg: isVeg,
          time: time,
        };
        // recipe  = apiResponse.data;
        return recipe;
      }
    } catch (error) {
      throw error;
    }
  }
}

async function fetchUserData(email) {
  let user = await userDB.findOne({ email: email });
  return user;
}

async function addToFavorites(data) {
  let result = await userDB.findOneAndUpdate(
    { email: data.email },
    { $push: { favorite: data.recipe } },
    { new: true }
  );
  return result ? "success" : "failed";
}

async function removeFromFavorites(data) {
  try {
    const user = await userDB.findOne({ email: data.email });

    if (user) {
      // Manipulate the 'favorite' array in your application code
      user.favorite = user.favorite.filter(item => item.id !== data.id);

      // Save the changes
      await user.save();
      // console.log('Document updated successfully.');
      return "success";
    } else {
      // console.log('No document found matching the criteria.');
      return "failed";
    }
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error('Failed to update document');
  }
}




async function addToMyrecipes(email, recipe) {
  let recipesDb = await recipeDB.create(recipe);

  if (recipesDb) {
    var result = await userDB.findOneAndUpdate(
      { email: email },
      { $push: { myRecipes: recipesDb } }
    );
    //  return result?'success':'failed';
  }
  return result ? "success" : "failed";
}

module.exports = {
  fetchRandomRecipes,
  searchRecipes,
  fetchUserData,
  addToFavorites,
  addToMyrecipes,
  getRecipeById,
  removeFromFavorites
};
