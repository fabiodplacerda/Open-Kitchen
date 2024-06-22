export default class AuthorizationValidation {
  static authorizeAdmin = (req, res, next) => {
    if (req.body.role !== 'admin') {
      res
        .status(403)
        .json({ message: 'Access Denied. Must have admin permissions' });
    }
    next();
  };
}
