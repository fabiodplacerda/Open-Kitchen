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
