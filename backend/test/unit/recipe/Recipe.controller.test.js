import { expect } from 'chai';
import RecipeController from '../../../src/controller/Recipe.controller.js';
import recipesData from '../../data/recipesData.js';

import sinon from 'sinon';
const { recipes, newRecipe } = recipesData;

describe('RecipeController', () => {
  let recipeController, recipeService, req, res, testError;

  beforeEach(() => {
    recipeService = {
      createRecipe: sinon.stub(),
      getAllRecipes: sinon.stub(),
    };
    recipeController = new RecipeController(recipeService);
    req = {
      body: {},
      params: {},
    };
    res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    testError = new Error('test error');
  });

  describe('createRecipe Tests', () => {
    it('should add a new recipe ', async () => {
      recipeService.createRecipe.resolves(newRecipe);
      await recipeController.createRecipe(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(
        res.json.calledWith({
          message: 'Recipe created successfully',
          newRecipe: newRecipe,
        })
      ).to.be.true;
    });
    it('should send a 400 if body is null', async () => {
      req.body = null;

      await recipeController.createRecipe(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });
    it('should send a 400 if fails to create a recipe', async () => {
      recipeService.createRecipe.resolves(null);
      await recipeController.createRecipe(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Failed to create a new recipe' }))
        .to.be.true;
    });
    it('should send a 500 a error occurs', async () => {
      const testError = new Error('test error');
      recipeService.createRecipe.throws(testError);
      await recipeController.createRecipe(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'test error' })).to.be.true;
    });
  });
  describe('getAllRecipes Tests', () => {
    it('should get all recipes and return', async () => {
      recipeService.getAllRecipes.resolves(recipes);
      await recipeController.getAllRecipes(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          message: 'Request was successful',
          recipes,
        })
      ).to.be.true;
    });

    it('should send a 500 a error occurs', async () => {
      const testError = new Error('test error');
      recipeService.getAllRecipes.throws(testError);
      await recipeController.getAllRecipes(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'test error' })).to.be.true;
    });
  });
});
