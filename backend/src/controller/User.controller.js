import UserServices from '../services/User.service.js';

export default class UserController {
  #service;

  constructor(service = new UserServices()) {
    this.#service = service;
  }

  createAccount = async (req, res) => {
    const { body } = req;
    try {
      const newUser = await this.#service.createAccount(body);

      if (!newUser) {
        res.status(400).json({ message: 'Failed to create a new user' });
      }

      const userData = {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      };

      res
        .status(201)
        .json({ message: 'User created successfully', newUser: userData });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}
