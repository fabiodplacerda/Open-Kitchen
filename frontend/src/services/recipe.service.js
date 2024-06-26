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
    console.log(response);
  } catch (e) {
    console.log(e);
    return e;
  }
};
