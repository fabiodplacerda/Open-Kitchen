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

// Models
import User from '../../src/models/user.model.js';
import Recipe from '../../src/models/recipe.model.js';

// Services
import UserServices from '../../src/services/User.service.js';
import RecipeService from '../../src/services/Recipe.service.js';

// Controller
import UserController from '../../src/controller/User.controller.js';
import RecipeController from '../../src/controller/Recipe.controller.js';

// Routes
import UserRoutes from '../../src/routes/User.routes.js';
import RecipeRoutes from '../../src/routes/Recipes.routes.js';

describe('Integration Tests', () => {
  let server, database, userService, recipeService, request;

  const { users, newUser, expectedResults } = usersData;
  const { recipes, newRecipe } = recipesData;

  before(async () => {
    Config.loadConfig();
    const { PORT, HOST, DB_URI } = process.env;

    userService = new UserServices();
    const userController = new UserController(userService);
    const userRoutes = new UserRoutes(userController);

    recipeService = new RecipeService();
    const recipeController = new RecipeController(recipeService);
    const recipeRoutes = new RecipeRoutes(recipeController);

    server = new Server(PORT, HOST, [userRoutes, recipeRoutes]);
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
      const hashedPassword = await bcrypt.hash('Password1', 10);
      const modifiedUsers = users.map(user => ({
        ...user,
        password: hashedPassword,
      }));
      await User.insertMany(modifiedUsers);
      await Recipe.insertMany(recipes);
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
  });
});
