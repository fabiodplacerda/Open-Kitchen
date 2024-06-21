import expressValidator from 'express-validator';

export default class UserValidator {
  static accountCreationValidate = () => {
    try {
      return [
        expressValidator.body('_id').optional().isMongoId(),
        expressValidator
          .body('email')
          .notEmpty()
          .isString()
          .withMessage('email is required')
          .isEmail()
          .withMessage('invalid email format'),
        expressValidator
          .body('username')
          .notEmpty()
          .isString()
          .withMessage('username is required')
          .isLength({ min: 3, max: 15 })
          .withMessage(
            'The username should be a minimum of 3 characters and a maximum of 10 characters in length.'
          ),
        expressValidator
          .body('password')
          .notEmpty()
          .isString()
          .withMessage('password is required')
          .isLength({ min: 8 })
          .withMessage('password must be at least 8 characters long')
          .matches(/(?=.*[A-Z])/)
          .withMessage('password must contain at least one uppercase letter')
          .matches(/(?=.*\d)/)
          .withMessage('password must contain at least one number'),
        expressValidator
          .body('role')
          .optional()
          .isString()
          .withMessage('Role must be a string')
          .isIn(['user', 'admin'])
          .withMessage('Role must be either "user" or "admin"'),
        expressValidator
          .body('savedRecipes')
          .optional()
          .isArray()
          .custom(arr => arr.every(id => expressValidator.isMongoId(id)))
          .isMongoId(),
        expressValidator
          .body('recipes')
          .optional()
          .isArray()
          .custom(arr => arr.every(id => expressValidator.isMongoId(id)))
          .isMongoId(),
        UserValidator.handleValidationErrors,
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
