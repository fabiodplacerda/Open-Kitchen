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
    console.log(e.response);
    if (
      e.response.data.message &&
      e.response.data.message.includes("dup key")
    ) {
      return {
        status: 500,
        message: "Username or Email already in use",
      };
    } else if (e.response) {
      return {
        status: e.response.status,
        message: e.response.statusText,
      };
    } else {
      return {
        status: 500,
        message: "Network Error",
      };
    }
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
    console.log(e.response);
    if (e.response) {
      return {
        status: e.response.status,
        message: e.response.statusText,
      };
    } else {
      return e;
    }
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

  try {
    const response = await axios.put(
      `http://localhost:3000/user/${userId}`,
      updates,
      { headers }
    );

    return response.data;
  } catch (e) {
    console.log(e.response);
    if (e.response) {
      return {
        status: e.response.status,
        message: e.response.statusText,
      };
    } else {
      return e;
    }
  }
};

export const getSingleUser = async (userId, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.get(`http://localhost:3000/user/${userId}`, {
      headers,
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const updateUserRecipes = async (user, setLoggedUser) => {
  const userData = await getSingleUser(user._id, user.userToken);
  localStorage.setItem(
    "user",
    JSON.stringify({ ...userData, userToken: user.userToken })
  );
  setLoggedUser({ ...userData, userToken: user.userToken });
};
