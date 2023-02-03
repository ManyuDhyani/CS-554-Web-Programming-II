const express = require('express');
const router = express.Router();
const data = require('../data');
const recipesData = data.recipes;
const commentsData = data.comments;
const likesData = data.likes;
const validationFunc = require('../helpers');


router
  .route('/')
  .post(async (req, res) => {
    try{
        recipeDetails = req.body
        let {title, ingredients, cookingSkillRequired, steps, userThatPosted} = recipeDetails
        await validationFunc.createRecipeValidator(title, ingredients, cookingSkillRequired, steps);

        userThatPosted = req.session.login.loggedUser;
        let recipePost = await recipesData.createRecipe(title, ingredients, cookingSkillRequired, steps, userThatPosted);
        return res.json(recipePost);
    } catch (e) {
        if (e.statusCode) {
            res.status(e.statusCode).json(e.error);
        } else {
            res.status(500).json("Internal Server Error");
        }
    }
  }).get(async (req, res) => {
    try{
      page = req.query.page;
      n = page ? page: null;
      let result = await recipesData.getRecipes(n);
      return res.json(result);
  } catch (e) {
      if (e.statusCode) {
          res.status(e.statusCode).json(e.error);
      } else {
          res.status(500).json("Internal Server Error");
      }
    }
  })

router
  .route('/:id')
  .get(async(req, res) => {
    try{
      // Validate the id
      await validationFunc.idValidator(req.params.id)

      let recipeDetails = await recipesData.getRecipeByID(req.params.id);
      return res.json(recipeDetails)
    } catch (e) {
        if (e.statusCode) {
            res.status(e.statusCode).json(e.error);
        } else {
            res.status(500).json("Internal Server Error");
        }
    }
  }).patch(async (req, res) => {
    try{
      recipeDetails = req.body
      let {title, ingredients, cookingSkillRequired, steps, userThatPosted} = recipeDetails

      title = title ? title : null;
      ingredients = ingredients ? ingredients : null;
      cookingSkillRequired = cookingSkillRequired ? cookingSkillRequired : null;
      steps = steps ? steps : null;
      await validationFunc.idValidator(req.params.id)
      
      userThatPosted = req.session.login.loggedUser;
      let recipePost = await recipesData.updateRecipe(req.params.id, title, ingredients, cookingSkillRequired, steps, userThatPosted);
      return res.json(recipePost);
    } catch (e) {
        if (e.statusCode) {
            res.status(e.statusCode).json(e.error);
        } else {
            res.status(500).json("Internal Server Error");
        }
    }
  })

router
  .route('/:id/comments')
  .post(async(req, res) => {
    try {
      // Validations
      await validationFunc.idValidator(req.params.id)

      userThatPostedComment = req.session.login.loggedUser;
      let result = await commentsData.creatComment(req.params.id, userThatPostedComment, req.body.comment);
      return res.json(result);

    } catch (e) {
      if (e.statusCode) {
          res.status(e.statusCode).json(e.error);
      } else {
          res.status(500).json("Internal Server Error");
      }
    }
  })


router
  .route('/:recipeId/:commentId')
  .delete(async(req, res) => {
    try{
      // Validations for ID
      await validationFunc.idValidator(req.params.recipeId)
      await validationFunc.idValidator(req.params.commentId)

      let currentUserID = req.session.login.loggedUser;
      let result = await commentsData.removeComment(req.params.recipeId, req.params.commentId, currentUserID);
      return res.json(result);
      
    } catch (e) {
      if (e.statusCode) {
          res.status(e.statusCode).json(e.error);
      } else {
          res.status(500).json("Internal Server Error");
      }
    }
  })


router
  .route('/:id/likes')
  .post(async(req, res) => {
    try{
      // Validations for ID
      await validationFunc.idValidator(req.params.id)
      
      let currentUserID = req.session.login.loggedUser;
      let result = await likesData.createLikes(req.params.id, currentUserID);
      return res.json(result);
      
    } catch (e) {
      if (e.statusCode) {
          res.status(e.statusCode).json(e.error);
      } else {
          res.status(500).json("Internal Server Error");
      }
    }
  })

module.exports = router;