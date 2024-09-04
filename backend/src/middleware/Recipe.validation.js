import expressValidator from 'express-validator';

export default class RecipeValidator {
  static recipeCreationValidate = () => {
    try {
      return [
        expressValidator.body('_id').optional().isMongoId(),
        expressValidator
          .body('author')
          .notEmpty()
          .isMongoId()
          .withMessage('author is required'),
        expressValidator
          .body('name')
          .notEmpty()
          .isString()
          .withMessage('recipe name is required and must be a string')
          .isLength({ min: 3, max: 30 })
          .withMessage(
            'The recipe name should be a minimum of 3 characters and a maximum of 30 characters in length.'
          ),
        expressValidator
          .body('category')
          .notEmpty()
          .isMongoId()
          .withMessage('category is required'),
        expressValidator
          .body('imgUrl')
          .notEmpty()
          .isURL()
          .withMessage('image url is required'),
        expressValidator
          .body('description')
          .notEmpty()
          .isString()
          .withMessage('description is required and must be a string')
          .isLength({ min: 50 })
          .withMessage(
            'The recipe description should be a minimum of 50 characters in length.'
          ),
        expressValidator
          .body('reviews')
          .optional()
          .isArray()
          .custom(arr => arr.every(id => expressValidator.isMongoId(id)))
          .isMongoId(),
        RecipeValidator.handleValidationErrors,
      ];
    } catch (e) {
      console.log(e);
      return [];
    }
  };
  static updateRecipeValidate = () => {
    try {
      return [
        expressValidator.body('userId').notEmpty().isMongoId(),
        expressValidator
          .body('updates.author')
          .notEmpty()
          .isMongoId()
          .withMessage('author is required'),
        expressValidator
          .body('updates.name')
          .notEmpty()
          .isString()
          .withMessage('recipe name is required and must be a string')
          .isLength({ min: 3, max: 30 })
          .withMessage(
            'The recipe name should be a minimum of 3 characters and a maximum of 30 characters in length.'
          ),
        expressValidator
          .body('updates.imgUrl')
          .notEmpty()
          .isURL()
          .withMessage('image url is required'),
        expressValidator
          .body('updates.description')
          .notEmpty()
          .isString()
          .withMessage('description is required and must be a string')
          .isLength({ min: 50 })
          .withMessage(
            'The recipe description should be a minimum of 50 characters in length.'
          ),
        RecipeValidator.handleValidationErrors,
      ];
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  static handleValidationErrors = (req, res, next) => {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
}
