import axios from "axios";

const recipeUrl = import.meta.env.VITE_APP_RECIPE;

export const getReviews = async (recipeId) => {
  try {
    const response = await axios.get(`${recipeUrl}/${recipeId}/reviews`);

    return response.data;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};

export const createReview = async (recipeId, newReview, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await axios.post(
      `${recipeUrl}/${recipeId}/createReview`,
      newReview,
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

export const deleteReview = async (recipeId, reviewId, userId, role, token) => {
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
      `${recipeUrl}/${recipeId}/reviews/${reviewId}`,
      dataToSend
    );

    return response.status;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};
