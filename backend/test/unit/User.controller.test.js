import { expect } from 'chai';
import UserController from '../../src/controller/User.controller.js';
import sinon from 'sinon';

describe('UserController test', () => {
  let userController, userService, req, res;

  beforeEach(() => {
    userService = {
      createAccount: sinon.stub(),
    };
    userController = new UserController(userService);
    req = {
      body: {},
      params: {},
    };
    res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };
  });

  describe('createAccount tests', () => {
    const testNewUser = {
      _id: '1',
      email: 'test@test.com',
      username: 'testUserName',
      password: 'Password123',
    };
    it('should add a new user ', async () => {
      userService.createAccount.resolves(testNewUser);

      await userController.createAccount(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(
        res.json.calledWith({
          message: 'User created successfully',
          newUser: testNewUser,
        })
      ).to.be.true;
    });
    it('should send a 400 if body is null', async () => {
      req.body = null;

      await userController.createAccount(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });
    it('should send a 400 if fails to create a user', async () => {
      userService.createAccount.resolves(null);
      await userController.createAccount(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Failed to create a new user' })).to
        .be.true;
    });
    it('should send a 500 a error occurs', async () => {
      const testError = new Error('test error');
      userService.createAccount.throws(testError);
      await userController.createAccount(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'test error' })).to.be.true;
    });
  });
});
