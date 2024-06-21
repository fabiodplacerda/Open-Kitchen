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
        return res.status(400).json({ message: 'Failed to create a new user' });
      }

      const userData = {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      };

      return res
        .status(201)
        .json({ message: 'User created successfully', newUser: userData });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
  accountLogin = async (req, res) => {
    const { body } = req;
    let formattedUser;
    try {
      if (!body || !Object.keys(body).length) {
        return res.status(400).json({ message: 'Invalid req.body' });
      }

      const result = await this.#service.accountLogin(
        body.username,
        body.password
      );

      if (!result) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      if (result.user._doc) {
        formattedUser = result.user._doc;
        delete formattedUser.password;
      } else {
        formattedUser = result.user;
      }

      return res.status(200).json({
        message: 'Authentication successful',
        user: formattedUser,
        token: result.token,
      });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
  updateAccount = async (req, res) => {
    const { id } = req.params;

    const updates = req.body;
    let formattedUser;

    try {
      const updatedUser = await this.#service.updateAccount(id, updates);

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (updatedUser._doc) {
        formattedUser = updatedUser._doc;
        delete formattedUser.password;
      } else {
        formattedUser = updatedUser;
      }

      return res
        .status(200)
        .json({ message: 'User updated successfully', user: formattedUser });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
}
