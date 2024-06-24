import { expect } from 'chai';
import RecipeController from '../../../src/controller/Recipe.controller.js';
import recipesData from '../../data/recipesData.js';

import sinon from 'sinon';
const { recipes, newRecipe, updatedRecipe } = recipesData;

describe('RecipeController', () => {
  let recipeController, recipeService, req, res, testError;

  beforeEach(() => {
    recipeService = {
      createRecipe: sinon.stub(),
      getAllRecipes: sinon.stub(),
      getSingleRecipe: sinon.stub(),
      updateRecipe: sinon.stub(),
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
  describe('getSingleRecipe Tests', () => {
    let singleRecipe;

    beforeEach(() => {
      singleRecipe = recipes[0];
    });

    it('should get all recipes and return', async () => {
      req.params.id = singleRecipe._id;

      recipeService.getSingleRecipe.resolves(singleRecipe);
      await recipeController.getSingleRecipe(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          message: 'Request was successful',
          recipe: singleRecipe,
        })
      ).to.be.true;
    });

    it('should send a 500 a error occurs', async () => {
      const testError = new Error('test error');
      recipeService.getSingleRecipe.throws(testError);
      await recipeController.getSingleRecipe(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'test error' })).to.be.true;
    });
  });
  describe('updateRecipe Tests', () => {
    let recipeToUpdate;

    beforeEach(() => {
      recipeToUpdate = recipes[0];
    });

    it('should update a recipe and return it', async () => {
      req.params.id = recipeToUpdate._id;

      recipeService.updateRecipe.resolves(updatedRecipe);
      await recipeController.updateRecipe(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          message: 'Recipe updated successfully',
          updatedRecipe,
        })
      ).to.be.true;
    });
    it('should return a 404 when recipe was not found', async () => {
      req.params.id = 'invalidId';

      recipeService.updateRecipe.resolves(null);
      await recipeController.updateRecipe(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(
        res.json.calledWith({
          message: 'Recipe not found',
        })
      ).to.be.true;
    });

    it('should send a 500 a error occurs', async () => {
      const testError = new Error('test error');
      recipeService.updateRecipe.throws(testError);
      await recipeController.updateRecipe(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'test error' })).to.be.true;
    });
  });
});
