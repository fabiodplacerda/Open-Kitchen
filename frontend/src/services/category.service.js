import axios from "axios";

const categoryUrl = import.meta.env.VITE_APP_CATEGORY;

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${categoryUrl}/getAllCategories`);

    return response.data;
  } catch (e) {
    return e.message;
  }
};
