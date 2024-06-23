import { expect } from 'chai';
import sinon from 'sinon';
import Recipe from '../../../src/models/recipe.model.js';
import RecipeService from '../../../src/services/Recipe.service.js';
import recipesData from '../../data/recipesData.js';

const { newRecipe } = recipesData;

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
});
