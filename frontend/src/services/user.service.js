import axios from "axios";

export const register = async (email, username, password) => {
  try {
    const user = await axios.post(`http://localhost:3000/user/createAccount`, {
      email,
      username,
      password,
    });

    return user.status;
  } catch (e) {
    console.log(e);
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`http://localhost:3000/user/login`, {
      username,
      password,
    });

    const { user, token } = response.data;

    localStorage.setItem("userToken", token);
    localStorage.setItem("userId", user._id);
    localStorage.setItem("userRole", user.role);

    return response.data;
  } catch (e) {
    return e.message;
  }
};

export const logout = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
};
