import axios from "axios";

export const getRecipes = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/recipe/getAllRecipes"
    );

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getSingleRecipe = async (recipeId) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/recipe/${recipeId}`
    );

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const addRecipe = async (newRecipe, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.post(
      "http://localhost:3000/recipe/createRecipe",
      newRecipe,
      { headers }
    );

    return response.data;
  } catch (e) {
    return e;
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
    const response = await axios.put(
      `http://localhost:3000/recipe/${recipeId}`,
      dataToSend,
      { headers }
    );

    return response.data;
  } catch (e) {}
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
    const response = await axios.delete(
      `http://localhost:3000/recipe/${recipeId}`,
      dataToSend
    );
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const getRecipesByAuthorId = async (authorId, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.get(
      `http://localhost:3000/recipe/author/${authorId}`,
      {
        headers,
      }
    );

    return response.data;
  } catch (e) {
    console.log(e);
  }
};
