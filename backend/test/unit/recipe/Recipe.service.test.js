import { assert, expect } from 'chai';
import sinon from 'sinon';
import Recipe from '../../../src/models/recipe.model.js';
import RecipeService from '../../../src/services/Recipe.service.js';
import recipesData from '../../data/recipesData.js';
import User from '../../../src/models/user.model.js';
import Review from '../../../src/models/review.model.js';
import usersData from '../../data/userData.js';

const { recipes, newRecipe, updatedRecipe, recipesByAuthorId, recipeByTerm } =
  recipesData;
const { users } = usersData;

describe('RecipeService Tests', () => {
  let recipeService;

  beforeEach(() => {
    recipeService = new RecipeService();
  });

  describe('createRecipe Tests', () => {
    it('should call save and return the result if a new has been successfully created', async () => {
      // Arrange
      const saveStub = sinon.stub(Recipe.prototype, 'save');
      const findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate');
      findByIdAndUpdateStub.resolves(users[0]);
      saveStub.returns(newRecipe);
      // Act
      const result = await recipeService.createRecipe(newRecipe);
      // Assert
      expect(result).to.equal(newRecipe);
      expect(saveStub.calledOnce).to.be.true;
      // Restore
      saveStub.restore();
      findByIdAndUpdateStub.restore();
    });
    it('should error when save fails', async () => {
      // Arrange
      const error = new Error('test error');

      const saveStub = sinon.stub(Recipe.prototype, 'save');
      const findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate');
      findByIdAndUpdateStub.resolves();
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
      findByIdAndUpdateStub.restore();
    });
  });
  describe('getAllRecipes Tests', () => {
    let findStub, populateStub;

    beforeEach(() => {
      populateStub = sinon.stub();
      findStub = sinon.stub(Recipe, 'find').returns({
        populate: populateStub,
      });
    });

    afterEach(() => {
      findStub.restore();
    });
    it('should call find and return all recipes', async () => {
      // Arrange
      populateStub.onFirstCall().returns({ populate: populateStub });
      populateStub.onSecondCall().resolves(recipes);
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
  describe('deleteRecipe Tests', () => {
    let findByIdStub,
      findByIdAndDeleteStub,
      recipeToDelete,
      authorId,
      findByIdAndUpdateStub,
      deleteManyStub,
      userFindByIdStub;

    beforeEach(() => {
      findByIdStub = sinon.stub(Recipe, 'findOne');
      findByIdAndDeleteStub = sinon.stub(Recipe, 'findByIdAndDelete');
      findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate');
      deleteManyStub = sinon.stub(Review, 'deleteMany');
      recipeToDelete = recipes[2];
      authorId = '667441c68299324f52841986';
      userFindByIdStub = sinon.stub(User, 'findById').resolves();
    });

    afterEach(() => {
      findByIdStub.restore();
      findByIdAndDeleteStub.restore();
      findByIdAndUpdateStub.restore();
      deleteManyStub.restore();
      userFindByIdStub.restore();
    });
    it('should call findById and findOneAndUpdate and return a the updated recipe', async () => {
      // Arrange
      findByIdStub.returns(recipeToDelete);
      findByIdAndDeleteStub.returns(recipeToDelete);
      // Act
      const result = await recipeService.deleteRecipe(
        recipeToDelete._id,
        authorId,
        'user'
      );
      // Assert
      expect(result).to.equal(recipeToDelete);
      expect(findByIdStub.calledOnce).to.be.true;
      expect(findByIdAndDeleteStub.calledOnce).to.be.true;
    });
    it('should error throw if a error occurs', async () => {
      // Arrange
      const error = new Error('test error');
      findByIdStub.returns(recipeToDelete);
      findByIdAndDeleteStub.throws(error);
      // Act && Assert
      try {
        await recipeService.deleteRecipe(recipeToDelete._id, authorId, 'user');
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(
          `Failed to delete the recipe: ${error.message}`
        );
      }
    });
  });
  describe('getRecipesByAuthorId', () => {
    it('should call find and return all the recipes create by the author', async () => {
      const populateStub = sinon.stub();
      const findStub = sinon.stub(Recipe, 'find').returns({
        populate: populateStub,
      });

      populateStub.onFirstCall().returns({ populate: populateStub });
      populateStub.onSecondCall().returns(recipesByAuthorId);

      const result = await recipeService.getRecipesByAuthorId(
        '667441c68299324f52841985'
      );

      expect(findStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(recipesByAuthorId);

      findStub.restore();
    });
    it('should error throw if a error occurs', async () => {
      const error = new Error('test error');
      const findStub = sinon.stub(Recipe, 'find').throws(error);

      try {
        await recipeService.getRecipesByAuthorId('667441c68299324f52841985');
        assert.fail('expected error was not thrown');
      } catch (e) {
        expect(e.message).to.deep.equal(
          `Failed to retrieve recipes by userId: ${error.message}`
        );
      }

      findStub.restore();
    });
  });
  describe('getRecipesByName', () => {
    it('should call find and return all the recipes matching the search term', async () => {
      const populateStub = sinon.stub();
      const findStub = sinon.stub(Recipe, 'find').returns({
        populate: populateStub,
      });

      populateStub.onFirstCall().returns({ populate: populateStub });
      populateStub.onSecondCall().returns(recipeByTerm);

      const result = await recipeService.getRecipesByName('pancake');

      expect(findStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(recipeByTerm);

      findStub.restore();
    });
    it('should error throw if a error occurs', async () => {
      const error = new Error('test error');
      const findStub = sinon.stub(Recipe, 'find').throws(error);

      try {
        await recipeService.getRecipesByName('pancake');
        assert.fail('expected error was not thrown');
      } catch (e) {
        expect(e.message).to.deep.equal(
          `Failed to retrieve recipes by name: ${error.message}`
        );
      }

      findStub.restore();
    });
  });
});
