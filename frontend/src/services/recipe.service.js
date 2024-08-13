import axios from "axios";

const recipeUrl = import.meta.env.VITE_APP_RECIPE;

export const getRecipes = async () => {
  try {
    const response = await axios.get(`${recipeUrl}/getAllRecipes`);

    return response.data;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};

export const getSingleRecipe = async (recipeId) => {
  try {
    const response = await axios.get(`${recipeUrl}/${recipeId}`);

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
    const response = await axios.post(`${recipeUrl}/createRecipe`, newRecipe, {
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
    const response = await axios.put(`${recipeUrl}/${recipeId}`, dataToSend, {
      headers,
    });

    return response.data;
  } catch (e) {
    return e.message;
  }
};

export const deleteRecipe = async (recipeId, userId, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const dataToSend = {
    data: {
      userId,
    },
    headers,
  };

  try {
    const response = await axios.delete(`${recipeUrl}/${recipeId}`, dataToSend);

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
    const response = await axios.get(`${recipeUrl}/author/${authorId}`, {
      headers,
    });

    return response.data;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};

export const getRecipesByName = async (searchTerm) => {
  try {
    const response = await axios.get(
      `${recipeUrl}/search?recipeName=${searchTerm}`
    );

    return response.data;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};
