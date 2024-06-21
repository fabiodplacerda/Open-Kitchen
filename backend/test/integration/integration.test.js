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

// Models
import User from '../../src/models/user.model.js';

// Services
import UserServices from '../../src/services/User.service.js';

// Controller
import UserController from '../../src/controller/User.controller.js';

// Routes
import UserRoutes from '../../src/routes/User.routes.js';

describe('Integration Tests', () => {
  let server, database, userService, request;

  const { users, newUser } = usersData;

  before(async () => {
    Config.loadConfig();
    const { PORT, HOST, DB_URI } = process.env;
    userService = new UserServices();
    const userController = new UserController(userService);
    const userRoutes = new UserRoutes(userController);

    server = new Server(PORT, HOST, [userRoutes]);
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
      await User.deleteMany();
      const hashedPassword = await bcrypt.hash('Password1', 10);
      const modifiedUsers = users.map(user => ({
        ...user,
        password: hashedPassword,
      }));
      await User.insertMany(modifiedUsers);
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
          user: testUserWithoutPassword,
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
      it('should respond with a 500 status if a error occurs when creating an account', async () => {
        const error = new Error('test error');
        const stub = sinon.stub(userService, 'accountLogin');
        stub.throws(error);

        const response = await request.post('/user/login').send(testUser);

        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: error.message });
      });
    });
  });
});
