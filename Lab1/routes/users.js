//require express, express router and bcrypt as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const validationFunc = require('../helpers');
const xss = require('xss');

router
  .route('/signup')
  .post(async (req, res) => {
    //code here for POST
    let name = xss(req.body.name)
    let username = xss(req.body.username);
    let password = xss(req.body.password);
    try {
      await validationFunc.createValidator(username, password);
      await validationFunc.nameValidator(name);
      
      let registerationStatus = await usersData.createUser(name, username, password);
      if (registerationStatus.insertedUser === true) {
        res.json("User is Signed Up");
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
      login = JSON.stringify(req.session.login)
      res.json("User is logged in! "+login)
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