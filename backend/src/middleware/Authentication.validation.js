import jwt from 'jsonwebtoken';

export default class AuthenticationValidation {
  static checkToken = (req, res, next) => {
    const authHeader =
      req.headers['x-access-token'] || req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: 'Failed to authenticate token' });
      }
      req.user = decoded;
      next();
    });
  };
}
