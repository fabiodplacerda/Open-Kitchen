import { expect } from 'chai';
import sinon from 'sinon';
import Recipe from '../../../src/models/recipe.model.js';
import RecipeService from '../../../src/services/Recipe.service.js';
import recipesData from '../../data/recipesData.js';

const { recipes, newRecipe, updatedRecipe } = recipesData;

describe('RecipeService Tests', () => {
  let recipeService;

  beforeEach(() => {
    recipeService = new RecipeService();
  });

  describe('createRecipe Tests', () => {
    it('should call save and return the result if a new has been successfully created', async () => {
      // Arrange
      const saveStub = sinon.stub(Recipe.prototype, 'save');
      saveStub.returns(newRecipe);
      // Act
      const result = await recipeService.createRecipe(newRecipe);
      // Assert
      expect(result).to.equal(newRecipe);
      expect(saveStub.calledOnce).to.be.true;
      // Restore
      saveStub.restore();
    });
    it('should error when save fails', async () => {
      // Arrange
      const error = new Error('test error');
      const saveStub = sinon.stub(Recipe.prototype, 'save');
      saveStub.throws(error);
      // Act && Assert

      try {
        await recipeService.createRecipe(newRecipe);
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(
          `Failed to create a new recipe: ${error.message}`
        );
      }
      // Restore
      saveStub.restore();
    });
  });
  describe('getAllRecipes Tests', () => {
    let findStub;

    beforeEach(() => {
      findStub = sinon.stub(Recipe, 'find');
    });

    afterEach(() => {
      findStub.restore();
    });
    it('should call find and return all recipes', async () => {
      // Arrange
      findStub.returns(recipes);
      // Act
      const result = await recipeService.getAllRecipes(recipes);
      // Assert
      expect(result).to.equal(recipes);
      expect(findStub.calledOnce).to.be.true;
    });
    it('should error throw if a error occurs', async () => {
      // Arrange
      const error = new Error('test error');
      findStub.throws(error);
      // Act && Assert
      try {
        await recipeService.getAllRecipes(recipes);
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(
          `Failed to retrieve all recipes: ${error.message}`
        );
      }
    });
  });
  describe('getSingleRecipe Tests', () => {
    let findOneStub;
    let singleRecipe;

    beforeEach(() => {
      findOneStub = sinon.stub(Recipe, 'findOne');
      singleRecipe = recipes[0];
    });

    afterEach(() => {
      findOneStub.restore();
    });
    it('should call find and return a single recipe', async () => {
      // Arrange
      findOneStub.returns(singleRecipe);
      // Act
      const result = await recipeService.getSingleRecipe(singleRecipe);
      // Assert
      expect(result).to.equal(singleRecipe);
      expect(findOneStub.calledOnce).to.be.true;
    });
    it('should error throw if a error occurs', async () => {
      // Arrange
      const error = new Error('test error');
      findOneStub.throws(error);
      // Act && Assert
      try {
        await recipeService.getSingleRecipe(singleRecipe);
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(
          `Failed to retrieve the recipe: ${error.message}`
        );
      }
    });
  });
  describe('updateRecipe Tests', () => {
    let findByIdStub, findOneAndUpdateStub, recipeToUpdate, authorId;

    beforeEach(() => {
      findByIdStub = sinon.stub(Recipe, 'findOne');
      findOneAndUpdateStub = sinon.stub(Recipe, 'findOneAndUpdate');
      recipeToUpdate = recipes[0];
      authorId = '667441c68299324f52841985';
    });

    afterEach(() => {
      findByIdStub.restore();
      findOneAndUpdateStub.restore();
    });
    it('should call findById and findOneAndUpdate and return a the updated recipe', async () => {
      // Arrange
      findByIdStub.returns(recipeToUpdate);
      findOneAndUpdateStub.returns(updatedRecipe);
      // Act
      const result = await recipeService.updateRecipe(
        recipeToUpdate._id,
        authorId
      );
      // Assert
      expect(result).to.equal(updatedRecipe);
      expect(findByIdStub.calledOnce).to.be.true;
      expect(findOneAndUpdateStub.calledOnce).to.be.true;
    });
    it('should error throw if a error occurs', async () => {
      // Arrange
      const error = new Error('test error');
      findByIdStub.returns(recipeToUpdate);
      findOneAndUpdateStub.throws(error);
      // Act && Assert
      try {
        await recipeService.updateRecipe(updatedRecipe, authorId);
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(
          `Failed to update the recipe: ${error.message}`
        );
      }
    });
  });
});
