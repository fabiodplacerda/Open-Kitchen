import axios from "axios";

const userUrl = import.meta.env.VITE_APP_RECIPE;

export const getRecipes = async () => {
  try {
    const response = await axios.get(`${userUrl}/getAllRecipes`);

    return response.data;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};

export const getSingleRecipe = async (recipeId) => {
  try {
    const response = await axios.get(`${userUrl}/${recipeId}`);

    return response.data;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};

export const addRecipe = async (newRecipe, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.post(`${userUrl}/createRecipe`, newRecipe, {
      headers,
    });

    return response.data;
  } catch (e) {
    return e.message;
  }
};

export const updateRecipe = async (recipeId, userId, updates, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const dataToSend = {
    userId,
    updates,
  };

  try {
    const response = await axios.put(`${userUrl}/${recipeId}`, dataToSend, {
      headers,
    });

    return response.data;
  } catch (e) {
    return e.message;
  }
};

export const deleteRecipe = async (recipeId, userId, role, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const dataToSend = {
    data: {
      userId,
      role,
    },
    headers,
  };

  try {
    const response = await axios.delete(`${userUrl}/${recipeId}`, dataToSend);

    return response.status;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};

export const getRecipesByAuthorId = async (authorId, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.get(`${userUrl}/author/${authorId}`, {
      headers,
    });

    return response.data;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};
