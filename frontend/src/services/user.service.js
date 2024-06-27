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

export const updateUser = async (userId, updates, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  console.log(userId, updates, token);

  try {
    const response = await axios.put(
      `http://localhost:3000/user/${userId}`,
      updates,
      { headers }
    );

    return response.data;
  } catch (e) {
    return {
      status: e.response.status,
      statusText: e.response.statusText,
    };
  }
};
