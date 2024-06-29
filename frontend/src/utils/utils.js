export const passwordMatchConfirmation = (password, cPassword) =>
  password === cPassword;

export const allValidFields = (email, username, password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;

  return (
    emailRegex.test(email) &&
    usernameRegex.test(username) &&
    passwordRegex.test(password)
  );
};

export const recipeInputValid = (recipeName, imgUrl, recipeDescription) => {
  const recipeNameRegex = recipeName.length >= 3 && recipeName.length <= 30;
  const recipeDescriptionRegex = recipeDescription.length >= 50;
  const imageRegex =
    /^(https?:\/\/(?:www\.)?[^\.]+\.[^/]+\/.*\.(?:png|jpg|jpeg|gif|bmp|svg))$/;
  return imageRegex.test(imgUrl) && recipeNameRegex && recipeDescriptionRegex;
};

export const calculateAverage = (reviews) => {
  if (reviews.length === 0) {
    return 0;
  } else if (reviews.length === 1) {
    return reviews[0].rating;
  } else {
    const ratings = reviews.map((review) => review.rating);
    const total = ratings.reduce((acc, curr) => acc + curr, 0);
    return total / reviews.length;
  }
};
