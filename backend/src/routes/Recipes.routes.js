import { Router } from 'express';
import RecipeController from '../controller/Recipe.controller.js';
import RecipeValidator from '../middleware/Recipe.validation.js';
import AuthenticationValidation from '../middleware/Authentication.validation.js';

export default class RecipeRoutes {
  #controller;
  #routeStartingPoint;
  #router;

  constructor(
    controller = new RecipeController(),
    routeStartingPoint = '/recipe'
  ) {
    this.#router = Router();
    this.#controller = controller;
    this.#routeStartingPoint = routeStartingPoint;
    this.#initializedRoutes();
  }

  #initializedRoutes = () => {
    this.#router.post(
      '/createRecipe',
      AuthenticationValidation.checkToken,
      RecipeValidator.recipeCreationValidate(),
      this.#controller.createRecipe
    );
    this.#router.get('/getAllRecipes', this.#controller.getAllRecipes);
    this.#router.get('/:id', this.#controller.getSingleRecipe);
  };

  getRouter = () => this.#router;

  getRouteStartingPoint = () => this.#routeStartingPoint;
}
