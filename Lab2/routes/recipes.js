const express = require('express');
const router = express.Router();
const data = require('../data');
const recipesData = data.recipes;
const commentsData = data.comments;
const likesData = data.likes;
const validationFunc = require('../helpers');
const bluebird = require('bluebird');

const redis = require('redis');
const client = redis.createClient();


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router
  .route('/')
  .post(async (req, res) => {
    try{
        recipeDetails = req.body
        let {title, ingredients, cookingSkillRequired, steps, userThatPosted} = recipeDetails
        await validationFunc.createRecipeValidator(title, ingredients, cookingSkillRequired, steps);

        userThatPosted = req.session.login.loggedUser;
        let recipePost = await recipesData.createRecipe(title, ingredients, cookingSkillRequired, steps, userThatPosted);
        
        // Cache the data
        let recipeID = recipePost._id
        recipeID = recipeID.trim()
        await client.setAsync(recipeID, JSON.stringify(recipePost))
        
        // Initialize the sorted list with recipe Obj and score 1
        await client.zaddAsync("recipeLeaderboard", 1, recipeID);
        
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

      // Store the result in cache
      if (n == null) n = 1;
      await client.setAsync(`PAGE ${n}`, JSON.stringify(result))

      // For Handling the cache of PAGE n: Initialize the redis list with PAGE n wher n is 1,2,3 ...and so on.
      await client.zaddAsync("pages", 1, `PAGE ${n}`);

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
      recipeID = req.params.id
      recipeID = recipeID.trim()

      let recipeDetails = await recipesData.getRecipeByID(recipeID);

      // Store the result in cache
      await client.setAsync(recipeID, JSON.stringify(recipeDetails))

      // Check if the recipe is in the list
      let recipeExist = await client.zrankAsync("recipeLeaderboard", recipeID);
      if (recipeExist !== null) {
        client.zincrby("recipeLeaderboard", 1, recipeID);
      } else {
        await client.zaddAsync("recipeLeaderboard", 1, recipeID);
      }

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

      // Store the result in cache
      let recipeID = req.params.id
      recipeID = recipeID.trim()
      await client.setAsync(recipeID, JSON.stringify(recipePost))

      // Check if the member exist in the sorted list
      let recipeExist = await client.zrankAsync("recipeLeaderboard", recipeID);
      if (recipeExist !== null) {
        // Increment the score of the memeber
        client.zincrby("recipeLeaderboard", 1, recipeID);
      } else {
        await client.zaddAsync("recipeLeaderboard", 1, recipeID);
      }

      // Delete PAGE N cache
      const pages = await client.zrevrangeAsync('pages', 0, -1);
      for (n of pages) {
        client.del(n)
      }

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
      
      // Store the result in cache
      let recipeID = req.params.id
      recipeID = recipeID.trim()
      await client.setAsync(recipeID, JSON.stringify(result))

      // Check if the member exist in the sorted list
      let recipeExist = await client.zrankAsync("recipeLeaderboard", recipeID);
      if (recipeExist !== null) {
        // Increment the score of the memeber
        client.zincrby("recipeLeaderboard", 1, recipeID);
      } else {
        await client.zaddAsync("recipeLeaderboard", 1, recipeID);
      }

      // Delete PAGE N cache
      const pages = await client.zrevrangeAsync('pages', 0, -1);
      for (n of pages) {
        client.del(n)
      }
      
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
      
      // Store the result in cache
      let recipeID = req.params.recipeId
      recipeID = recipeID.trim()
      await client.setAsync(recipeID, JSON.stringify(result))

      // Check if the member exist in the sorted list
      let recipeExist = await client.zrankAsync("recipeLeaderboard", recipeID);
      if (recipeExist !== null) {
        // Increment the score of the memeber
        client.zincrby("recipeLeaderboard", 1, recipeID);
      } else {
        await client.zaddAsync("recipeLeaderboard", 1, recipeID);
      }

      // Delete PAGE N cache
      const pages = await client.zrevrangeAsync('pages', 0, -1);
      for (n of pages) {
        client.del(n)
      }
      
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

      // Store the result in cache
      let recipeID = req.params.id
      recipeID = recipeID.trim()
      await client.setAsync(recipeID, JSON.stringify(result))

      // Check if the member exist in the sorted list
      let recipeExist = await client.zrankAsync("recipeLeaderboard", recipeID);
      if (recipeExist !== null) {
        // Increment the score of the memeber
        client.zincrby("recipeLeaderboard", 1, recipeID);
      } else {
        await client.zaddAsync("recipeLeaderboard", 1, recipeID);
      }

      // Delete PAGE N cache
      const pages = await client.zrevrangeAsync('pages', 0, -1);
      for (n of pages) {
        client.del(n)
      }
      
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