const mongoCollections = require('../config/mongoCollections');
const { recipes } = require('../config/mongoCollections');
let { ObjectId } = require('mongodb');
const validationFunc = require('../helpers');


const createLikes = async (recipeID, currentUser) => {
    // ID validation
    await validationFunc.idValidator(recipeID);
    recipeID = recipeID.trim();

    let recipesCollection = await recipes();
    let recipeFound = await recipesCollection.findOne({_id: ObjectId(recipeID)});
    if (!recipeFound) throw {statusCode: 404, error: `No recipe found with id: ${recipeID}`};

    let unlike = false;
    recipeFound.likes.forEach(likedUser => {
        if (likedUser === currentUser._id){
            unlike = true;
        }
    });

    if (unlike === true){
         for (const user of recipeFound.likes){
            let result = await recipesCollection.updateMany({}, {$pull: {likes: currentUser._id}});
            if (result.modifiedCount === 1) break;
            if (result.modifiedCount === 0) throw `Unable to delete the like for user with id ${currentUser._id}`;
        }
    } else {
        let likedRecipe = await recipesCollection.updateOne({_id: ObjectId(recipeID)}, {$addToSet: {likes: currentUser._id}});
        if (likedRecipe.modifiedCount === 0) throw {statusCode: 500, error: `Unable to like to the recipe`};
    }

    let updatedRecipeFound = await recipesCollection.findOne({_id: ObjectId(recipeID)});
    if (!updatedRecipeFound) {
        throw {statusCode: 404, error: `Cannot Retrive Recipe after liking it, with Id: ${recipeID}`};
      }
    
    updatedRecipeFound._id = updatedRecipeFound._id.toString();
    updatedRecipeFound.comments.forEach(comment => {
        comment._id = comment._id.toString();
    });

    return updatedRecipeFound;
};

module.exports = {
    createLikes
}