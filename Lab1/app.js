// Setup server, session and middleware here.

const express = require('express');
const app = express();

const configRoutes = require('./routes');
const session = require('express-session');

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}));

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
  console.log(requestBody)
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

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});