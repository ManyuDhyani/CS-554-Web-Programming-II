const mongoCollections = require('../config/mongoCollections');
const { recipes } = require('../config/mongoCollections');
let { ObjectId } = require('mongodb');
const validationFunc = require('../helpers');


const getRecipes = async(n) => {
  let recipesCollection = await recipes();
  let result = [];

  if (n == 1 || n == null) {
    result = await recipesCollection.find({}).limit(50).toArray();
  } else {
    if (n < 1) throw {statusCode: 400, error: "Page number is Invalide"};
    if (/^[0-9a-zA-Z .,@&():;!]+$/.test(n) == true){
      if(/^[0-9]*$/.test(n) == false) {
        throw {statusCode: 400, error: "Page number is Invalide"};
      }
    }
    result = await recipesCollection.find({}).skip(50*(n-1)).limit(50).toArray();
  }
  if (result.length === 0) throw {statusCode: 404, error: "There are no more recipes"};
  
  result.forEach(element => {
    element._id = element._id.toString();
  });
  return result;
};

const createRecipe = async (
    title, ingredients, cookingSkillRequired, steps, userThatPosted
  ) => {

    // Validations
    await validationFunc.createRecipeValidator(title, ingredients, cookingSkillRequired, steps);
    title = title.trim()
    cookingSkillRequired = cookingSkillRequired.trim()
    
    let recipesCollection = await recipes();

    let newRecipe = {
      title: title,
      ingredients: ingredients,
      cookingSkillRequired: cookingSkillRequired,
      steps: steps,
      userThatPosted: userThatPosted,
      comments: [],
      likes: []
    }
  
    let insertRecipe = await recipesCollection.insertOne(newRecipe);
    if (!insertRecipe.acknowledged ||  insertRecipe.insertedCount === 0) throw {statusCode: 500, error: "Internal Server Error"};

    let newRecipeID = insertRecipe.insertedId;
    let result = await recipesCollection.findOne({_id: newRecipeID});
    result._id = result._id.toString();

    return result;
   };
  

const updateRecipe = async (
  recipeID, title, ingredients, cookingSkillRequired, steps, userThatPosted
) => {
  // Validations
  await validationFunc.idValidator(recipeID);
  recipeID = recipeID.trim();

  let recipesCollection = await recipes();

  let findRecipe = await recipesCollection.findOne({_id: ObjectId(recipeID)});
  if (!findRecipe) throw {statusCode: 404, error: `There is no Recipe with ID: ${recipeID}`};

  title = title ? title : findRecipe.title;
  ingredients = ingredients ? ingredients : findRecipe.ingredients;
  cookingSkillRequired = cookingSkillRequired ? cookingSkillRequired : findRecipe.cookingSkillRequired;
  steps = steps ? steps : findRecipe.steps;
  await validationFunc.createRecipeValidator(title, ingredients, cookingSkillRequired, steps);
  title = title.trim()
  cookingSkillRequired = cookingSkillRequired.trim()

  if (userThatPosted._id !== findRecipe.userThatPosted._id.toString()) throw {statusCode: 401, error: "You are not Authorization to make changes in the Recipe."}

  let sortedIngredients = [...ingredients]
  sortedIngredients = sortedIngredients.sort()
  let sortedSteps = [...steps]
  sortedSteps = sortedSteps.sort()
  findRecipe.ingredients.sort()
  findRecipe.steps.sort()

  // Checking if no value is updated
  if (findRecipe.title == title && findRecipe.cookingSkillRequired == cookingSkillRequired) {
    if (sortedIngredients.forEach((x, i) => x == findRecipe.ingredients[i])) {
      if (sortedSteps.forEach((x, i) => x == findRecipe.steps[i])){
        throw {statusCode: 400, error: `At least 1 new value needed to update`};
      }
    }
  }

  let comments = findRecipe.comments
  let likes = findRecipe.likes

  let updatedRecipe = {
    title: title,
    ingredients: ingredients,
    cookingSkillRequired: cookingSkillRequired,
    steps: steps,
    userThatPosted: userThatPosted,
    comments: comments,
    likes: likes
  }

  modifiedRecipe = await recipesCollection.updateOne(
    {_id: ObjectId(recipeID)},
    {$set: updatedRecipe}
  );

  if (modifiedRecipe.modifiedCount === 0){
    throw {statusCode: 400, error: `No new value! Unable to update Recipe`};
  }

  let newUpdatedRecipe = await recipesCollection.findOne({_id: ObjectId(recipeID)});
  if (!newUpdatedRecipe) {
    throw {statusCode: 404, error: `Cannot Retrive Recipe after it got updated with Id: ${recipeID}`};
  }

  newUpdatedRecipe._id = newUpdatedRecipe._id.toString();
  return newUpdatedRecipe;
};


const getRecipeByID = async (recipeID) => {
  // ID validation
  await validationFunc.idValidator(recipeID);
  recipeID = recipeID.trim();

  let recipesCollection = await recipes();
  let recipeFound = await recipesCollection.findOne({_id: ObjectId(recipeID)});
  if (!recipeFound) throw {statusCode: 404, error: `No recipe found with id: ${recipeID}`};
  recipeFound._id = recipeFound._id.toString();
  return recipeFound;
};

module.exports = {
  getRecipes,
  createRecipe,
  updateRecipe,
  getRecipeByID
}