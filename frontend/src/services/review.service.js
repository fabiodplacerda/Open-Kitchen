import axios from "axios";

export const getReviews = async (recipeId) => {
  console.log(recipeId);
  try {
    const response = await axios.get(
      `http://localhost:3000/recipe/${recipeId}/reviews`
    );

    return response.data;
  } catch (e) {
    console.log(e);
  }
};
