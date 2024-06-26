import axios from "axios";

export const getReviews = async (recipeId) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/recipe/${recipeId}/reviews`
    );

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const createReview = async (recipeId, newReview, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.post(
      `http://localhost:3000/recipe/${recipeId}/createReview`,
      newReview,
      { headers }
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
