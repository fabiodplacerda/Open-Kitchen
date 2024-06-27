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

    if (response.data.token) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...response.data.user,
          userToken: response.data.token,
        })
      );
    }

    return response.data;
  } catch (e) {
    return e.message;
  }
};

export const logout = () => {
  localStorage.removeItem(`user`);
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(`user`));
};
