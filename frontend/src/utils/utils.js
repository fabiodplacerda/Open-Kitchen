export const passwordMatchConfirmation = (password, cPassword) =>
  password === cPassword;

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const itMatches = passwordRegex.test(password);
  return itMatches;
};
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const itMatches = emailRegex.test(email);
  return itMatches;
};
export const validateUsername = (username) => {
  const itMatches = username.length >= 3 && username.length <= 15;
  return itMatches;
};

export const allValidFields = (email, username, password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return (
    emailRegex.test(email) &&
    username.length >= 3 &&
    username.length <= 15 &&
    passwordRegex.test(password)
  );
};

export const recipeInputValid = (recipeName, imgUrl, recipeDescription) => {
  console.log(recipeName, imgUrl, recipeDescription);
  const recipeNameRegex = recipeName.length >= 3 && recipeName.length <= 30;
  const recipeDescriptionRegex = recipeDescription.length >= 50;
  const imageRegex =
    /^(https?:\/\/(?:www\.)?[^\.]+\.[^/]+\/.*\.(?:png|jpg|jpeg|gif|bmp|svg))$/;
  console.log(
    imageRegex.test(imgUrl) && recipeNameRegex && recipeDescriptionRegex
  );
  return imageRegex.test(imgUrl) && recipeNameRegex && recipeDescriptionRegex;
};
