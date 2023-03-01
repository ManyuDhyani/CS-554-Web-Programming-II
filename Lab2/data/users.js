const mongoCollections = require('../config/mongoCollections');
const validationFunc = require('../helpers');
const bcrypt = require('bcrypt');
const saltRounds = 16;
const { user } = require('../config/mongoCollections');

const createUser = async (
  name, username, password
) => { 

  // Error checking for name, username and password
  await validationFunc.createValidator(username, password);
  await validationFunc.nameValidator(name);
  name = name.trim()

  let userCollection = await user();

  // Convert to lower Case before saving the username
  username = username.toLowerCase();

  // Check if user with the username exist in the database
  let userExist = await userCollection.findOne({username: username});
  if (userExist) throw {statusCode: 400, error: "Already a user with that username exist in the Database"};
  
  // Hash user password and insert user in database
  let encryptedPassword = await bcrypt.hash(password, saltRounds);
  let newUser = {
    name: name,
    username: username,
    password: encryptedPassword
  }
  
  let insertUser = await userCollection.insertOne(newUser);
  if (!insertUser.acknowledged ||  insertUser.insertedCount === 0) throw {statusCode: 500, error: "Internal Server Error"};

  userJson = {
    _id: insertUser.insertedId.toString(),
    name: name,
    username: username
  }

  return {insertedUser: true, userJson: userJson};
};

const checkUser = async (username, password) => { 

  // Error checking for username and password
  await validationFunc.createValidator(username, password);

  let userCollection = await user();

  // Convert to lower Case before saving the username
  username = username.toLowerCase();

  // Check if user with the username exist in the database
  let userExist = await userCollection.findOne({username: username});
  if (!userExist) throw {statusCode: 401, error: "Either the username or password is invalid"};

  let comparePswd = await bcrypt.compare(password, userExist.password);
  if(!comparePswd) throw {statusCode: 401, error: "Either the username or password is invalid"};

  let userJson = {
    _id: userExist._id,
    name: userExist.name,
    username: userExist.username
  }

  userDetails = {
    _id: userExist._id,
    username: userExist.username
  }

  return {loggedUser: userDetails, authenticatedUser: true, userJson: userJson};
};

module.exports = {
  createUser,
  checkUser
};
