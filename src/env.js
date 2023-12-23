 const spoonacularApiKey ='35549cddc59547a4a77117bf5e718612'
const environment = {
randomRecipesUrl:'https://api.spoonacular.com/recipes/random?apiKey='+spoonacularApiKey  + '&addRecipeInformation=true&number=12&fillIngredients=true',
searchrecipe:'https://api.spoonacular.com/recipes/complexSearch?apiKey='+spoonacularApiKey+'&addRecipeInformation=true&number=100&fillIngredients=true&query=',
headers1:{
    headers: {
        'Content-Type': 'application/json',
      }
}
}
module.exports = {environment , spoonacularApiKey};