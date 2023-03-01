// Setup server, session and middleware here.

const express = require('express');
const app = express();

const configRoutes = require('./routes');
const session = require('express-session');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const connectRedis = require("connect-redis")

const redis = require('redis');
const { json } = require('express');
const { connect } = require('./routes/users');
const RedisStore =  connectRedis(session);
const client = redis.createClient();

const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.use(session({
  store: new RedisStore({ client: client }),
  secret: 'AuthCookie',
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: true, // if true prevent client side JS from reading the cookie 
      maxAge: 1000 * 60 * 10 // session max age in miliseconds
  }
}))


//Authentication Middleware
app.use('/recipes', (req, res, next) => {
  if (req.method == "POST" || req.method == "PATCH" || req.method == "DELETE") {
    if (!req.session.login) {
      return res.status(403).json("Forbidden Access: User is not logged in");
    }
  }
  next();
});

// Keep Track of requestBody and HTTP verb
app.use((req, res, next) => {
  let requestMethod = req.method;
  let requestRoute = req.originalUrl;
  let requestBody = req.body
  if(req.body.password){
    let pswd = req.body.password
    delete req.body.password
    console.log(requestBody);
    req.body.password = pswd;
  } else {
    console.log(requestBody);
  }
  console.log(`${requestMethod}  ${requestRoute}`);
  next();
});

// Logging URL Count Middleware
let urlSet = new Map();
app.use((req, res, next) => {
  let requestRoute = req.originalUrl;
  if (requestRoute in urlSet){
    urlSet[requestRoute] += 1
  } else {
    urlSet[requestRoute] = 1
  }
  console.log(requestRoute + " : " + urlSet[requestRoute])
  next();
});

// Redis Middleware: GET	/recipes
app.use('/recipes', async (req, res, next) => {
  let requestRoute = req.originalUrl;
  if(req.method == 'GET'){
    if(requestRoute == '/recipes' || requestRoute.includes("page")) {
      page = req.query.page;
      n = page ? page: null;
      if (n == null) n = 1;
      let exists = await client.existsAsync(`PAGE ${n}`);
      if (exists){
        let resultFromCache = await client.getAsync(`PAGE ${n}`)
        return res.send(JSON.parse(resultFromCache));
      } 
    }
  }
  next();
});

// Redis Middleware: GET	/recipes/:id
app.use('/recipes/:id', async (req, res, next) => {
  if(req.method == 'GET') {
    // Create not found for other URL matching /recipes/:id pattern
    let requestRoute = req.originalUrl;
    if (requestRoute.match(/^\/recipes\/\w+\/comments$/) || requestRoute.match(/^\/recipes\/\w+\/\w+$/) || requestRoute.match(/^\/recipes\/\w+\/likes$/)) {
      return res.status(404).json("Not Found");
    }
    let recipeID = req.params.id
    recipeID = recipeID.trim()
  
    let exists = await client.existsAsync(recipeID);
    if (exists){
      let resultFromCache = await client.getAsync(recipeID)
      resultFromCache = JSON.parse(resultFromCache)
      let recipeExist = await client.zrankAsync("recipeLeaderboard", recipeID);
      if (recipeExist !== null) {
        client.zincrby("recipeLeaderboard", 1, recipeID);
      }
      
      return res.send(resultFromCache);
    }
  }
  next();
});




configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});