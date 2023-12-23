const http = require("http");
const environment = require("./src/env");
const utils = require("./src/utils/utils");
const url = require("url");
const auth = require("./src/utils/auth");
const mongoose = require("mongoose");
// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://bheemuk123:JylNuBtHy324cnK9@cluster0.0mszlya.mongodb.net/Recipe?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

const server = http.createServer(async (req, res) => {
  // Set CORS headers to allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Include 'Content-Type' here
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  if (req.url === "/getRandomRecipes" && req.method === "GET") {
     try{
      let recipes = await utils.fetchRandomRecipes();
      res.write(JSON.stringify({ data: recipes }));
      res.end();
     }catch(Error){
      res.write(JSON.stringify({ data: "something went wrong" }));
      res.end();
     }
  } else if (req.url.startsWith("/search/recipes")) {
    const parsedUrl = url.parse(req.url);
    // Get the query string from the URL
    const query = parsedUrl.query.split("=")[1];
    let recipes = await utils.searchRecipes(query);
    res.write(JSON.stringify({ data: recipes }));
    res.end();
  } 
  else if(req.url.startsWith("/getRecipeById") && req.method === "GET"){
    try{
      const parsedUrl = url.parse(req.url);
    // Get the query string from the URL
    const id = parsedUrl.query.split("=")[1];
    let recipe = await utils.getRecipeById(id);
    res.write(JSON.stringify({ data: recipe }));
    res.end();
    }
    catch(Error){
      res.write(JSON.stringify({ data: "something went wrong" }));
    res.end();
    }
  }
  
  else if (req.url === "/user/register" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      // try {
      const obj = JSON.parse(body);
      let status = await auth.registerUser(obj);
      if (status == true) {
        const responseData = { message: "success" };
        const jsonResponse = JSON.stringify(responseData);
        res.writeHead(201);
        res.end(jsonResponse);
      }
      else if(status == 'user exist'){
        const responseData = { message: "user already exist with this email" };
        const jsonResponse = JSON.stringify(responseData);
        res.writeHead(400);
        res.end(jsonResponse);
      } else {
        const responseData = { message: "failed" };
        const jsonResponse = JSON.stringify(responseData);
        res.writeHead(201);
        res.end(jsonResponse);
      }
   
    });
  }
  else if(req.url === "/user/login" && req.method === "POST"){
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    
    req.on("end", async () => {
      const obj = JSON.parse(body);
      const responseData =await auth.loginUser(obj);
        const jsonResponse = JSON.stringify(responseData);
        res.writeHead(200);
        res.end(jsonResponse);
      });
  }
  else if(req.url === "/user/updateRecent" && req.method === "POST"){
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const obj = JSON.parse(body);
      let status = await auth.updateRecent(obj);
      res.end(JSON.stringify({status : status}));
    });
  } 
  else if(req.url === "/user/fetchRecent" && req.method === "POST"){
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const obj = JSON.parse(body);
      let data = await utils.fetchUserData(obj.email);
      res.end(JSON.stringify({status : "ok", data:data.recent.reverse()}));
    });
  }
  else if(req.url === "/user/fetchFavorite" && req.method === "POST"){
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const obj = JSON.parse(body);
      let data = await utils.fetchUserData(obj.email);
      res.end(JSON.stringify({status : "ok", data:data.favorite
    }));
    });
  }
  else if(req.url === "/user/AddToFavorite" && req.method === "POST"){
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const obj = JSON.parse(body);
      let result = await utils.addToFavorites(obj);
      res.end(JSON.stringify({status : result}));
    });
  }
  else if(req.url === "/user/myRecipe" && req.method === "POST"){
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const obj = JSON.parse(body);
      let result = await utils.addToMyrecipes(obj.email , obj.recipe);
      res.end(JSON.stringify({status : result}));
    });
  }
  else if(req.url === "/user/fetchMyRecipes" && req.method === "POST"){
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const obj = JSON.parse(body);
      let data = await utils.fetchUserData(obj.email);
      res.end(JSON.stringify({status : "ok", data:data.myRecipes
    }));
    });
  }
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
