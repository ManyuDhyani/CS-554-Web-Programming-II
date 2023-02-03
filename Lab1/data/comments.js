const mongoCollections = require('../config/mongoCollections');
const { recipes } = require('../config/mongoCollections');
let { ObjectId } = require('mongodb');
const validationFunc = require('../helpers');

const creatComment = async(recipeID, userThatPostedComment, comment) => {
    // Validations
    await validationFunc.idValidator(recipeID)
    await validationFunc.commentValidator(comment)
    recipeID = recipeID.trim()
    comment = comment.trim()

    let recipesCollection = await recipes();
    let recipeFound = await recipesCollection.findOne({_id: ObjectId(recipeID)});
    if (!recipeFound) throw {statusCode: 404, error: `No recipe found with id: ${recipeID}`};

    let newComment = {
        _id: ObjectId(),
        userThatPostedComment: userThatPostedComment, 
        comment: comment
    }

    let updatedRecipe = await recipesCollection.updateOne({_id: ObjectId(recipeID)}, {$addToSet: {comments: newComment}});
    if (updatedRecipe.modifiedCount === 0) throw {statusCode: 500, error: `Unable to add the comment to the recipe`};

    let updatedRecipeFound = await recipesCollection.findOne({_id: ObjectId(recipeID)});
    if (!updatedRecipeFound) {
        throw {statusCode: 404, error: `Cannot Retrive Recipe after adding comment, with Id: ${recipeID}`};
      }
    
    updatedRecipeFound._id = updatedRecipeFound._id.toString();
    updatedRecipeFound.comments.forEach(comment => {
        comment._id = comment._id.toString();
    });

    return updatedRecipeFound;
};

const removeComment = async (recipeID, commentID, currentUserID) => {
    // ID Validations
    await validationFunc.idValidator(recipeID)
    await validationFunc.idValidator(commentID)
    recipeID = recipeID.trim()
    commentID = commentID.trim()

    let recipesCollection = await recipes();
    let recipeFound = await recipesCollection.findOne({_id: ObjectId(recipeID)});
    if (!recipeFound) throw {statusCode: 404, error: `No Recipe found with id: ${recipeID}`};

    let commentExist = 0;
    for (const comment of recipeFound.comments){
        if (comment._id.toString() === commentID){
            commentExist = 1;
        }
    }
    if (!commentExist) throw {statusCode: 404, error: `No comment found with id: ${commentID}`};

    let deleted = false
    for (const comment of recipeFound.comments){
        if (comment._id.toString() === commentID){
            if (comment.userThatPostedComment._id.toString() === currentUserID._id) {
                let updatedRecipe = await recipesCollection.updateMany({}, {$pull: {comments: {_id: ObjectId(commentID)}}});
                if (updatedRecipe.modifiedCount === 0) {
                    throw `Unable to delete the comment with id ${commentID}`;
                }
                deleted = true;
            }
        }
    }

    if (deleted === false) {
        throw {statusCode: 401, error: `You are not authorized to delete comment with id: ${commentID}`};
    }

    if (deleted === true) {
        let updatedRecipeFound = await recipesCollection.findOne({_id: ObjectId(recipeID)});
        if (!updatedRecipeFound) throw {statusCode: 404, error: "Cannot find recipe after deleting the comment"};
        updatedRecipeFound._id = updatedRecipeFound._id.toString();
        updatedRecipeFound.comments.forEach(comment => {
            comment._id = comment._id.toString();
        });
        return updatedRecipeFound; 
    }

};

module.exports = {
    creatComment,
    removeComment
}