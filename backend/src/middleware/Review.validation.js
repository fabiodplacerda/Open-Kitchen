import expressValidator from 'express-validator';

export default class ReviewValidator {
  static reviewCreation = () => {
    try {
      return [
        expressValidator.body('_id').optional().isMongoId(),
        expressValidator
          .body('author')
          .notEmpty()
          .isMongoId()
          .withMessage('author is required'),
        expressValidator
          .body('recipeId')
          .notEmpty()
          .isMongoId()
          .withMessage('recipeID is required'),
        expressValidator
          .body('body')
          .notEmpty()
          .isString()
          .withMessage('review body is required and must be a string')
          .isLength({ min: 3, max: 50 })
          .withMessage(
            'The review body should be a minimum of 3 characters and a maximum of 30 characters in length.'
          ),
        expressValidator
          .body('rating')
          .notEmpty()
          .isInt({ min: 1, max: 5 })
          .withMessage('rating must be a number and must be between 1 and 5'),
        ReviewValidator.handleValidationErrors,
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
