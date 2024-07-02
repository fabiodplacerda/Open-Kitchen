import supertest from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Config from '../../src/config/Config.js';
import Server from '../../src/server/Server.js';
import Database from '../../src/database/Database.js';

// Test Data
import usersData from '../data/userData.js';
import recipesData from '../data/recipesData.js';
import reviewsData from '../data/reviewsData.js';

// Models
import User from '../../src/models/user.model.js';
import Recipe from '../../src/models/recipe.model.js';
import Review from '../../src/models/review.model.js';

// Services
import UserServices from '../../src/services/User.service.js';
import RecipeService from '../../src/services/Recipe.service.js';
import ReviewService from '../../src/services/Review.service.js';

// Controller
import UserController from '../../src/controller/User.controller.js';
import RecipeController from '../../src/controller/Recipe.controller.js';
import ReviewController from '../../src/controller/Review.controller.js';

// Routes
import UserRoutes from '../../src/routes/User.routes.js';
import RecipeRoutes from '../../src/routes/Recipes.routes.js';
import ReviewRoutes from '../../src/routes/Review.routes.js';

describe('Integration Tests', () => {
  let server, database, userService, recipeService, reviewService, request;

  const { users, newUser, expectedResults, expectedSingleUserResult } =
    usersData;
  const {
    recipes,
    newRecipe,
    updatedRecipe,
    recipesByAuthorId,
    allRecipesResult,
  } = recipesData;
  const { reviews, newReview, expectedReviews, expectedNewReview } =
    reviewsData;

  before(async () => {
    Config.loadConfig();
    const { PORT, HOST, DB_URI } = process.env;

    userService = new UserServices();
    const userController = new UserController(userService);
    const userRoutes = new UserRoutes(userController);

    recipeService = new RecipeService();
    const recipeController = new RecipeController(recipeService);
    const recipeRoutes = new RecipeRoutes(recipeController);

    reviewService = new ReviewService();
    const reviewController = new ReviewController(reviewService);
    const reviewRoutes = new ReviewRoutes(reviewController);

    server = new Server(PORT, HOST, [userRoutes, recipeRoutes, reviewRoutes]);
    database = new Database(DB_URI);

    await database.connect();
    server.start();

    request = supertest(server.getApp());
  });

  after(async () => {
    server.close();
    await database.disconnect();
  });

  beforeEach(async () => {
    try {
      await Recipe.deleteMany();
      await User.deleteMany();
      await Review.deleteMany();
      const hashedPassword = await bcrypt.hash('Password1', 10);
      const modifiedUsers = users.map(user => ({
        ...user,
        password: hashedPassword,
      }));
      await User.insertMany(modifiedUsers);
      await Recipe.insertMany(recipes);
      await Review.insertMany(reviews);
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });
  describe('User Tests', () => {
    describe('POST request to /user/createAccount', () => {
      it('should respond with a 201 status code when request is successful', async () => {
        const response = await request
          .post('/user/createAccount')
          .send(newUser);
        expect(response.status).to.equal(201);
      });

      it('should send the new user back in the body response', async () => {
        const response = await request
          .post('/user/createAccount')
          .send(newUser);
        const addedUser = {
          id: response.body.newUser.id,
          username: response.body.newUser.username,
          email: response.body.newUser.email,
          role: response.body.newUser.role,
        };

        expect(response.body.newUser).to.deep.equal(addedUser);
      });

      it('should respond with a 400 status code if when adding a new user one of the required fields is missing', async () => {
        const newInvalidUser = { ...newUser, username: null };
        const response = await request
          .post('/user/createAccount')
          .send(newInvalidUser);

        expect(response.status).to.equal(400);
      });

      it('should respond with a 400 status if no payload was sent in the body', async () => {
        const response = await request.post('/user/createAccount').send(null);

        expect(response.status).to.equal(400);
      });
      it('should respond with a 500 status if a error occurs when creating an account', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(userService, 'createAccount');
        stub.throws(error);

        const response = await request
          .post('/user/createAccount')
          .send(newUser);

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });
        stub.restore();
      });
    });
    describe('POST request to /user/login', () => {
      beforeEach(() => {
        sinon.stub(jwt, 'sign').returns('testToken');
      });

      afterEach(() => {
        jwt.sign.restore();
      });

      const testUser = { ...users[0], password: 'Password1' };
      const { password, ...testUserWithoutPassword } = testUser;
      const testToken = 'testToken';

      it('should respond with a 200 status code when request is successful', async () => {
        const response = await request.post('/user/login').send(testUser);

        expect(response.status).to.equal(200);
      });

      it('should send the new user back in the body response', async () => {
        const response = await request.post('/user/login').send(testUser);

        expect(response.body).to.deep.equal({
          message: 'Authentication successful',
          user: expectedResults,
          token: testToken,
        });
      });

      it('should respond with a 400 status code if no payload was sent in the body', async () => {
        const response = await request.post('/user/login').send(null);

        expect(response.status).to.equal(400);
      });

      it("should respond with a 401 if password doesn't match", async () => {
        const userWithWrongPassword = {
          ...testUserWithoutPassword,
          password: 'WrongPassword',
        };
        const response = await request
          .post('/user/login')
          .send(userWithWrongPassword);

        expect(response.status).to.equal(401);
      });
      it('should respond with a 500 status if a error occurs when login in to an account', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(userService, 'accountLogin');
        stub.throws(error);

        const response = await request.post('/user/login').send(testUser);

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });

        stub.restore();
      });
    });
    describe('PUT request to /user/:id', () => {
      const testUser = { ...users[0], password: 'Password1' };
      const updates = {
        email: 'newEmail@gmail.com',
        username: 'updatedUser1',
        password: 'myNewPassWord1',
      };
      const updatedUser = {
        ...testUser,
        email: updates.email,
        username: updates.username,
      };

      delete updatedUser.password;

      const token = jwt.sign(
        { id: testUser._id, username: testUser.username },
        'openkitchen-secret-key-test',
        { expiresIn: '24h' }
      );
      const { password, ...testUserWithoutPassword } = testUser;

      it('should respond with a 200 if was successfully updated', async () => {
        const response = await request
          .put(`/user/${testUser._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updates);

        expect(response.status).to.equal(200);
      });

      it('should send the updated user back in the body response', async () => {
        const response = await await request
          .put(`/user/${testUser._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updates);

        expect(response.body.user).to.deep.equal(updatedUser);
      });

      it('should respond with a 404 status code if user was not found', async () => {
        const response = await await request
          .put(`/user/667441c68289324f52241985`)
          .set('Authorization', `Bearer ${token}`)
          .send(updates);

        expect(response.status).to.equal(404);
        expect(response.body).to.deep.equal({ message: 'User not found' });
      });

      it('should respond with a 401 if token was not provided', async () => {
        const response = await await request
          .put(`/user/${testUser._id}`)
          .send(updates);

        expect(response.status).to.equal(401);
        expect(response.body).to.deep.equal({ message: 'No token provided' });
      });
      it('should respond with a 403 if auth fails', async () => {
        const response = await await request
          .put(`/user/667441c68289324f52241985`)
          .set('Authorization', `Bearer invalidToken`)
          .send(updates);

        expect(response.status).to.equal(403);
        expect(response.body).to.deep.equal({
          message: 'Failed to authenticate token',
        });
      });
      it('should respond with a 500 status if a error occurs when updating an account', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(userService, 'updateAccount');
        stub.throws(error);

        const response = await request
          .put(`/user/${testUser._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updates);

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });

        stub.restore();
      });
    });
    describe('DELETE request to /user/:id', () => {
      const userToDelete = users[4];

      const token = jwt.sign(
        { id: userToDelete._id, username: userToDelete.username },
        'openkitchen-secret-key-test',
        { expiresIn: '1h' }
      );

      it('should respond with a 204 if was delete successfully', async () => {
        const response = await request
          .delete(`/user/${userToDelete._id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(204);
      });
      it('should respond with a 404 if user not found', async () => {
        const response = await request
          .delete(`/user/667441c68299324f52841920`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(404);
        expect(response.body).to.deep.equal({ message: 'User not found' });
      });
      it('should respond with a 401 if token was not provided', async () => {
        const response = await request.delete(`/user/${userToDelete._id}`);

        expect(response.status).to.equal(401);
        expect(response.body).to.deep.equal({ message: 'No token provided' });
      });
      it('should respond with a 403 if auth fails', async () => {
        const response = await request
          .delete(`/user/${userToDelete._id}`)
          .set('Authorization', `Bearer invalidToken`);

        expect(response.status).to.equal(403);
        expect(response.body).to.deep.equal({
          message: 'Failed to authenticate token',
        });
      });
      it('should respond with a 500 status if a error occurs when deleting an account', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(userService, 'deleteAccount');
        stub.throws(error);

        const response = await request
          .delete(`/user/${userToDelete._id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });

        stub.restore();
      });
    });
    describe('GET request to /user/getAllAccounts', () => {
      const baseUser = users[0];
      const admin = users[1];

      const token = jwt.sign(
        { id: admin._id, username: admin.username },
        'openkitchen-secret-key-test',
        { expiresIn: '1h' }
      );
      const userToken = jwt.sign(
        { id: baseUser._id, username: baseUser.username },
        'openkitchen-secret-key-test',
        { expiresIn: '1h' }
      );

      it('should respond with a 200 if request was successful', async () => {
        const response = await request
          .get(`/user/getAllAccounts`)
          .set('Authorization', `Bearer ${token}`)
          .send(admin);

        expect(response.status).to.equal(200);
      });
      it('should respond with an array of users', async () => {
        const usersWithoutPassword = users.map(user => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });

        const response = await request
          .get(`/user/getAllAccounts`)
          .set('Authorization', `Bearer ${token}`)
          .send(admin);

        expect(response.body).to.deep.equal(usersWithoutPassword);
      });
      it('should respond with a 401 status code when no token was provided', async () => {
        const response = await request
          .get(`/user/getAllAccounts`)

          .send(admin);

        expect(response.status).to.equal(401);
      });
      it('should respond with a 403 status if authentication fails', async () => {
        const response = await request
          .get(`/user/getAllAccounts`)
          .set('Authorization', `Bearer invalid`)
          .send(admin);

        expect(response.status).to.equal(403);
      });
      it('should respond with a 403 status if user is not admin', async () => {
        const response = await request
          .get(`/user/getAllAccounts`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(baseUser);

        expect(response.status).to.equal(403);
        expect(response.body).to.deep.equal({
          message: 'Access Denied. Must have admin permissions',
        });
      });
      it('should respond with a 500 status if a error was thrown in the service', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(userService, 'getAllAccounts');
        stub.throws(error);

        const response = await request
          .get(`/user/getAllAccounts`)
          .set('Authorization', `Bearer ${token}`)
          .send(admin);

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });
      });
    });
    describe('GET request to /user/:id', () => {
      const token = jwt.sign(
        {
          id: expectedSingleUserResult._id,
          username: expectedSingleUserResult.username,
        },
        'openkitchen-secret-key-test',
        { expiresIn: '24h' }
      );
      it('should return a 200 status code if request was successful', async () => {
        const response = await request
          .get(`/user/${expectedSingleUserResult._id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
      });
      it('should return a user if request was successful', async () => {
        const response = await request
          .get(`/user/${expectedSingleUserResult._id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.body).to.deep.equal(expectedSingleUserResult);
      });
      it('should respond with a 401 if token was not provided', async () => {
        const response = await request.get(
          `/user/${expectedSingleUserResult._id}`
        );

        expect(response.status).to.equal(401);
      });
      it('should respond with a 403 if auth fails', async () => {
        const response = await request
          .get(`/user/${expectedSingleUserResult._id}`)
          .set('Authorization', `Bearer invalidToken`);

        expect(response.status).to.equal(403);
      });
      it('should return a 404 status code if no user was found', async () => {
        const response = await request
          .get(`/user/667441c68299324f52841910`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(404);
        expect(response.body).to.deep.equal({ message: 'User not found' });
      });
      it('should return a 500 status code a error occurs', async () => {
        const error = new Error('Test error');
        const stub = sinon.stub(userService, 'getSingleUser');
        stub.throws(error);
        const response = await request
          .get(`/user/667441c68299324f52841910`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });

        stub.restore();
      });
    });
  });
  describe('Recipe Tests', () => {
    describe('POST request to /recipe/createRecipe', () => {
      const user = users[3];

      const token = jwt.sign(
        { id: user._id, username: user.username },
        'openkitchen-secret-key-test',
        { expiresIn: '1h' }
      );
      it('should respond with a 201 status code when request is successful', async () => {
        const response = await request
          .post('/recipe/createRecipe')
          .set('Authorization', `Bearer ${token}`)
          .send(newRecipe);

        expect(response.status).to.equal(201);
      });
      it('should add the recipe to the database', async () => {
        await request
          .post('/recipe/createRecipe')
          .set('Authorization', `Bearer ${token}`)
          .send(newRecipe);

        const allRecipes = await Recipe.find();
        const recipesToObject = allRecipes.map(recipe => {
          return {
            _id: recipe._id.toString(),
            author: recipe.author.toString(),
            name: recipe.name,
            imgUrl: recipe.imgUrl,
            description: recipe.description,
            reviews: recipe.reviews.map(id => id.toString()),
            __v: recipe.__v,
          };
        });

        expect(recipesToObject).to.deep.equal([...recipes, newRecipe]);
      });

      it('should send the new recipe back in the body response', async () => {
        const response = await request
          .post('/recipe/createRecipe')
          .set('Authorization', `Bearer ${token}`)
          .send(newRecipe);

        expect(response.body.newRecipe).to.deep.equal({ ...newRecipe, __v: 0 });
      });

      it('should respond with a 400 status code if when adding a new user one of the required fields is missing', async () => {
        const invalidRecipe = { ...newRecipe, name: null };
        const response = await request
          .post('/recipe/createRecipe')
          .set('Authorization', `Bearer ${token}`)
          .send(invalidRecipe);

        expect(response.status).to.equal(400);
      });
      it('should respond with a 401 status code  if no token was provided', async () => {
        const response = await request
          .post('/recipe/createRecipe')
          .send(newRecipe);

        expect(response.status).to.equal(401);
      });
      it('should respond with a 403 status code  if the token was provide but is invalid', async () => {
        const response = await request
          .post('/recipe/createRecipe')
          .set('Authorization', `Bearer ${null}`)
          .send(newRecipe);

        expect(response.status).to.equal(403);
      });
      it('should respond with a 500 status if a error occurs when creating a new recipe', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(recipeService, 'createRecipe');
        stub.throws(error);

        const response = await request
          .post('/recipe/createRecipe')
          .set('Authorization', `Bearer ${token}`)
          .send(newRecipe);

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });
        stub.restore();
      });
    });
    describe('GET request to /recipe/getAllRecipes', () => {
      it('should respond with a 200 status code when request is successful', async () => {
        const response = await request.get('/recipe/getAllRecipes');

        expect(response.status).to.equal(200);
      });
      it('should respond with an array of recipes', async () => {
        const response = await request.get('/recipe/getAllRecipes');

        expect(response.body.recipes).to.deep.equal(allRecipesResult);
      });
      it('should respond with a 500 status if a error occurs when getting all the recipes', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(recipeService, 'getAllRecipes');
        stub.throws(error);
        const response = await request.get('/recipe/getAllRecipes');

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });
        stub.restore();
      });
    });
    describe('GET request to /recipe/:id', () => {
      it('should respond with a 200 status code when request is successful', async () => {
        const response = await request.get(`/recipe/${recipes[1]._id}`);

        expect(response.status).to.equal(200);
      });
      it('should respond with recipe object', async () => {
        const response = await request.get(`/recipe/${recipes[1]._id}`);

        expect(response.body.recipe).to.deep.equal(recipes[1]);
      });
      it('should respond with a 500 status if a error occurs when creating getting all the recipes', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(recipeService, 'getSingleRecipe');
        stub.throws(error);
        const response = await request.get(`/recipe/${recipes[1]._id}`);

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });
        stub.restore();
      });
    });
    describe('PUT request to /recipe/:id', () => {
      const user = users[0];
      const recipeToUpdate = recipes[0];

      const token = jwt.sign(
        { id: user._id, username: user.username },
        'openkitchen-secret-key-test',
        { expiresIn: '1h' }
      );

      const updates = {
        ...recipeToUpdate,
        name: 'Delicious Pancakes with bacon',
        description:
          'A simple and delicious recipe for fluffy pancakes with bacon that are perfect for breakfast.',
      };

      it('should respond with a 200 status code when recipe was successfully updated', async () => {
        const response = await request
          .put(`/recipe/${recipeToUpdate._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, updates });

        expect(response.status).to.equal(200);
      });
      it('should respond with a updated recipe object', async () => {
        const response = await request
          .put(`/recipe/${recipeToUpdate._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, updates });

        expect(response.body.updatedRecipe).to.deep.equal(updatedRecipe);
      });
      it('should have the update recipe in the database', async () => {
        await request
          .put(`/recipe/${recipeToUpdate._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, updates });

        const allRecipes = await Recipe.find();

        const updatedRecipeInDb = allRecipes.find(
          recipe => recipe._id.toString() === recipeToUpdate._id
        );

        const recipeToObject = {
          _id: updatedRecipeInDb._id.toString(),
          author: updatedRecipeInDb.author.toString(),
          description: updatedRecipeInDb.description,
          imgUrl: updatedRecipeInDb.imgUrl,
          name: updatedRecipeInDb.name,
          reviews: updatedRecipeInDb.reviews.map(review => review.toString()),
          __v: 0,
        };

        expect(recipeToObject).to.deep.equal(updatedRecipe);
      });
      it('should respond with a 400 if one of the updated fields is not valid', async () => {
        const response = await request
          .put(`/recipe/${recipeToUpdate._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: user._id,
            updates: { ...updates, imgUrl: 'hello' },
          });

        expect(response.status).to.equal(400);
      });
      it('should respond with a 404 if the recipe was not found', async () => {
        const response = await request
          .put(`/recipe/667441c68299324f52841920`)
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, updates });

        expect(response.status).to.equal(404);
      });
      it('should respond with a 401 no token was provided', async () => {
        const response = await request
          .put(`/recipe/667441c68299324f52841920`)
          .send({ userId: user._id, updates });

        expect(response.status).to.equal(401);
      });
      it('should respond with a 403 if a token was provided but it is invalid', async () => {
        const response = await request
          .put(`/recipe/667441c68299324f52841920`)
          .set('Authorization', `Bearer invalidToken`)
          .send({ userId: user._id, updates });

        expect(response.status).to.equal(403);
      });
      it('should respond with a 500 status if a error occurs when creating getting all the recipes', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(recipeService, 'updateRecipe');
        stub.throws(error);
        const response = await request
          .put(`/recipe/${recipeToUpdate._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: user._id,
            updates,
          });

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });
        stub.restore();
      });
    });
    describe('DELETE request to /recipe/:id', () => {
      const user = users[1];
      const recipeToDelete = recipes[2];

      const token = jwt.sign(
        { id: user._id, username: user.username },
        'openkitchen-secret-key-test',
        { expiresIn: '1h' }
      );
      it('should respond with a 204 status code when recipe was successfully updated', async () => {
        const response = await request
          .delete(`/recipe/${recipeToDelete._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, role: user.role });

        expect(response.status).to.equal(204);
      });

      it('should update the user recipes and should delete all the reviews associated with recipe', async () => {
        const expectedRecipesLength = user.recipes.length - 1;
        await request
          .delete(`/recipe/${recipeToDelete._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, role: user.role });

        const updatedUser = await User.findById(user._id);
        const afterDeleteReviews = await Review.find({
          recipeId: recipeToDelete._id,
        });

        expect(expectedRecipesLength).to.equal(updatedUser.recipes.length);
        expect(afterDeleteReviews).to.have.lengthOf(0);
      });
      it('should not have the deleted recipe in the database', async () => {
        await request
          .delete(`/recipe/${recipeToDelete._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, role: user.role });

        const allRecipes = await Recipe.find();

        const deleteRecipe = allRecipes.find(
          recipe => recipe._id.toString() === recipeToDelete._id
        );

        expect(deleteRecipe).to.equal(undefined);
      });
      it('should respond with a 404 if the recipe was not found', async () => {
        const response = await request
          .delete(`/recipe/667441c68299324f52841920`)
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, role: user.role });

        expect(response.status).to.equal(404);
      });
      it('should respond with a 401 no token was provided', async () => {
        const response = await request
          .delete(`/recipe/${recipeToDelete._id}`)
          .send({ userId: user._id, role: user.role });

        expect(response.status).to.equal(401);
      });
      it('should respond with a 403 if a token was provided but it is invalid', async () => {
        const response = await request
          .delete(`/recipe/${recipeToDelete._id}`)
          .set('Authorization', `Bearer invalidToken`)
          .send({ userId: user._id, role: user.role });

        expect(response.status).to.equal(403);
      });
      it('should respond with a 403 user is not the author and not the admin', async () => {
        const response = await request
          .delete(`/recipe/${recipeToDelete._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: 'notMatchingId', role: 'user' });

        expect(response.status).to.equal(403);
        expect(response.body).to.deep.equal({
          message:
            'Failed to delete the recipe: User has no permission to delete this recipe',
        });
      });
      it('should delete the recipe if user is not the author but it has admin role', async () => {
        const response = await request
          .delete(`/recipe/${recipeToDelete._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: 'notMatchingId', role: 'admin' });

        expect(response.status).to.equal(204);
      });
      it('should respond with a 500 status if a error occurs when creating getting all the recipes', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(recipeService, 'deleteRecipe');
        stub.throws(error);
        const response = await request
          .delete(`/recipe/${recipeToDelete._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, role: user.role });

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });
        stub.restore();
      });
    });
    describe('GET request to /recipe/author/:id', () => {
      let user, token;
      beforeEach(() => {
        user = users[0];
        token = jwt.sign(
          { id: user._id, username: user.username },
          'openkitchen-secret-key-test',
          { expiresIn: '1h' }
        );
      });
      it('should respond with a 200 status code when request as successful', async () => {
        const response = await request
          .get(`/recipe/author/${user._id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).to.equal(200);
      });
      it('should respond with an array of recipes', async () => {
        const response = await request
          .get(`/recipe/author/${user._id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.body).to.deep.equal(recipesByAuthorId);
      });
      it('should respond with an empty array if user has no recipes', async () => {
        const response = await request
          .get(`/recipe/author/${users[4]._id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.body).to.deep.equal([]);
      });
      it('should respond with a 401 no token was provided', async () => {
        const response = await request.get(`/recipe/author/${user._id}`);

        expect(response.status).to.equal(401);
      });
      it('should respond with a 403 if a token was provided but it is invalid', async () => {
        const response = await request
          .get(`/recipe/author/${user._id}`)
          .set('Authorization', `Bearer invalidToken`);

        expect(response.status).to.equal(403);
      });
      it('should respond with a 500 status if a error occurs when getting the recipes by authorId', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(recipeService, 'getRecipesByAuthorId');
        stub.throws(error);
        const response = await request
          .get(`/recipe/author/${user._Id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });
        stub.restore();
      });
    });
  });
  describe('Review Tests', () => {
    describe('POST request to /recipe/:id/createReview', () => {
      const recipe = recipes[3];
      const user = users[1];

      const token = jwt.sign(
        { id: user._id, username: user.username },
        'openkitchen-secret-key-test',
        { expiresIn: '1h' }
      );

      it('should respond with a 201 status code and the create review when review was successfully created', async () => {
        const response = await request
          .post(`/recipe/${recipe._id}/createReview`)
          .set('Authorization', `Bearer ${token}`)
          .send(newReview);

        expect(response.status).to.equal(201);
        expect(response.body.newReview).to.deep.equal(expectedNewReview);
      });
      it('should have added the comment in the database', async () => {
        await request
          .post(`/recipe/${recipe._id}/createReview`)
          .set('Authorization', `Bearer ${token}`)
          .send(newReview);

        const getAllReviews = await Review.find();
        const reviewsToObj = getAllReviews.map(review => {
          return {
            _id: review._id.toString(),
            author: review.author.toString(),
            recipeId: review.recipeId.toString(),
            body: review.body,
            rating: review.rating,
            __v: 0,
          };
        });

        const createdReview = reviewsToObj.find(
          recipe => recipe._id === newReview._id
        );

        expect(createdReview).to.deep.equal(newReview);
      });
      it('should respond with a 400 status code if one of the review fields is invalid', async () => {
        const response = await request
          .post(`/recipe/${recipe._id}/createReview`)
          .set('Authorization', `Bearer ${token}`)
          .send({ ...newReview, body: null });

        expect(response.status).to.equal(400);
      });

      it('should respond with a 401 status if no token was provided', async () => {
        const response = await request
          .post(`/recipe/${recipe._id}/createReview`)
          .send(newReview);

        expect(response.status).to.equal(401);
      });
      it('should respond with a 403 status if no valid token was provided', async () => {
        const response = await request
          .post(`/recipe/${recipe._id}/createReview`)
          .set('Authorization', `Bearer invalid`)
          .send(newReview);

        expect(response.status).to.equal(403);
      });
      it('should respond with a 500 status if there is an error when creating the review', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(reviewService, 'createReview');
        stub.throws(error);

        const response = await request
          .post(`/recipe/${recipe._id}/createReview`)
          .set('Authorization', `Bearer ${token}`)
          .send(newReview);

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });
        stub.restore();
      });
    });
    describe('GET request to /recipe/:id/reviews', () => {
      it('should respond with a 200 status code when request to get reviews by recipe id was successful', async () => {
        const recipe = recipes[0];
        const response = await request.get(`/recipe/${recipe._id}/reviews`);

        expect(response.status).to.equal(200);
      });
      it('should respond with an array of reviews', async () => {
        const recipe = recipes[0];
        const response = await request.get(`/recipe/${recipe._id}/reviews`);

        expect(response.body.reviews).to.deep.equal(expectedReviews);
      });
      it("should respond with an empty array if recipe doesn't have any reviews", async () => {
        const recipe = recipes[3];
        const response = await request.get(`/recipe/${recipe._id}/reviews`);

        expect(response.body.reviews).to.deep.equal([]);
      });
      it('should respond with a 500 status if a error occurs when creating getting the reviews', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(reviewService, 'getReviewsByRecipeId');
        stub.throws(error);
        const recipe = recipes[0];
        const response = await request.get(`/recipe/${recipe._id}/reviews`);

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });
        stub.restore();
      });
    });
    describe('DELETE request to /recipe/:recipeId/reviews/:reviewId', () => {
      const reviewToDelete = reviews[3];
      const user = users[4];

      const token = jwt.sign(
        { id: user._id, username: user.username },
        'openkitchen-secret-key-test',
        { expiresIn: '1h' }
      );
      it('should return a 204 status code when deleting a review was successful', async () => {
        const response = await request
          .delete(
            `/recipe/${reviewToDelete.recipeId}/reviews/${reviewToDelete._id}`
          )
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, role: user.role });

        expect(response.status).to.equal(204);
      });
      it('should not have the delete review in the database', async () => {
        await request
          .delete(
            `/recipe/${reviewToDelete.recipeId}/reviews/${reviewToDelete._id}`
          )
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, role: user.role });

        const reviewsInDb = await Review.find();
        const reviewsToObject = reviewsInDb.map(review => {
          return {
            _id: review._id.toString(),
            author: review.author.toString(),
            recipeId: review.recipeId.toString(),
            body: review.body,
            rating: review.rating,
            __v: 0,
          };
        });

        const findReview = reviewsToObject.find(
          review => review._id === reviewToDelete
        );

        expect(findReview).to.equal(undefined);
      });
      it('should have removed the deleted review from the recipe', async () => {
        await request
          .delete(
            `/recipe/${reviewToDelete.recipeId}/reviews/${reviewToDelete._id}`
          )
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, role: user.role });

        const recipe = await Recipe.findById(reviewToDelete.recipeId);

        const findDeletedReview = recipe.reviews.find(
          review => review.toString() === reviewToDelete._id
        );

        expect(findDeletedReview).to.equal(undefined);
      });

      it('should return a 404 status when review was not found', async () => {
        const response = await request
          .delete(
            `/recipe/${reviewToDelete.recipeId}/reviews/667441c68299324f52841210`
          )
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, role: user.role });

        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal('review was not found');
      });
      it('should return a 403 if user is not the author and also not admin role', async () => {
        const response = await request
          .delete(
            `/recipe/${reviewToDelete.recipeId}/reviews/${reviewToDelete._id}`
          )
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: users[0]._id, role: user.role });

        expect(response.status).to.equal(403);
      });
      it('should return a 204 if user is not the author and but has admin role', async () => {
        const response = await request
          .delete(
            `/recipe/${reviewToDelete.recipeId}/reviews/${reviewToDelete._id}`
          )
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: users[1]._id, role: users[1].role });

        expect(response.status).to.equal(204);
      });
      it('should respond with a 401 no token was provided', async () => {
        const response = await request
          .delete(
            `/recipe/${reviewToDelete.recipeId}/reviews/${reviewToDelete._id}`
          )
          .send({ userId: user._id, role: user.role });

        expect(response.status).to.equal(401);
      });
      it('should respond with a 403 if a token was provided but it is invalid', async () => {
        const response = await request
          .delete(
            `/recipe/${reviewToDelete.recipeId}/reviews/${reviewToDelete._id}`
          )
          .set('Authorization', `Bearer invalidToken`)
          .send({ userId: user._id, role: user.role });

        expect(response.status).to.equal(403);
      });
      it('should respond with a 500 status if a error occurs when deleting a review', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(reviewService, 'deleteReview');
        stub.throws(error);

        const response = await request
          .delete(
            `/recipe/${reviewToDelete.recipeId}/reviews/${reviewToDelete._id}`
          )
          .set('Authorization', `Bearer ${token}`)
          .send({ userId: user._id, role: user.role });

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });
        stub.restore();
      });
    });
  });
});
