import { Router } from 'express';
import UserController from '../controller/User.controller.js';
import UserValidator from '../middleware/User.validation.js';
import AuthValidation from '../middleware/Auth.validation.js';

export default class UserRoutes {
  #controller;
  #routeStartingPoint;
  #router;

  constructor(controller = new UserController(), routeStartingPoint = '/user') {
    this.#router = Router();
    this.#controller = controller;
    this.#routeStartingPoint = routeStartingPoint;
    this.#initializedRoutes();
  }

  #initializedRoutes = () => {
    this.#router.post(
      '/createAccount',
      UserValidator.accountCreationValidate(),
      this.#controller.createAccount
    );
    this.#router.post('/login', this.#controller.accountLogin);
    this.#router.put(
      '/:id',
      AuthValidation.checkToken,
      UserValidator.accountCreationValidate(),
      this.#controller.updateAccount
    );
  };

  getRouter = () => this.#router;

  getRouteStartingPoint = () => this.#routeStartingPoint;
}
