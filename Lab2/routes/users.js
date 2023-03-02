//require express, express router and bcrypt as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const recipesData = data.recipes;
const validationFunc = require('../helpers');
const xss = require('xss');
const bluebird = require('bluebird');

const redis = require('redis');
const client = redis.createClient();


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router
  .route('/mostaccessed')
  .get(async (req, res) => {
    const scores = await client.zrevrangeAsync('recipeLeaderboard', 0, 9);
    let leaderboard = []
    for (id of scores) {

      // Check if recipe Object is in cache and if not get it from DB.
      let exists = await client.existsAsync(id);
      if (exists) {
        let recipeFromCache = await client.getAsync(id)
        leaderboard.push(JSON.parse(recipeFromCache))
      } else {
        let recipeFromDB = await recipesData.getRecipeByID(id);
        leaderboard.push(recipeFromDB)
      }
    }
    return res.json(leaderboard)
  });

router
  .route('/signup')
  .post(async (req, res) => {
    //code here for POST
    let name = xss(req.body.name);
    let username = xss(req.body.username);
    let password = xss(req.body.password);
    try {
      await validationFunc.createValidator(username, password);
      await validationFunc.nameValidator(name);
      
      let registerationStatus = await usersData.createUser(name, username, password);
      if (registerationStatus.insertedUser === true) {
        res.json(registerationStatus.userJson);
      }
    } catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).json(e.error);
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  })
 
router
  .route('/login')
  .post(async (req, res) => {
    //code here for POST
    let username = xss(req.body.username);
    let password = xss(req.body.password);
    try {
      if(req.session.login) return res.status(400).json("A user is already logged in!");
      await validationFunc.createValidator(username, password);
      let loginDetails = await usersData.checkUser(username, password);
      req.session.login = loginDetails;
      req.session.username = username;
      res.json(loginDetails.userJson)
    } catch (e) {
      if (e.statusCode) {
        res.status(e.statusCode).json(e.error);
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  })

router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
    if(!req.session.login) return res.status(400).json("No user is logged In!");
    req.session.destroy();
    session = JSON.stringify(req.session)
    res.json("User is logged out now!");
  })

module.exports = router;