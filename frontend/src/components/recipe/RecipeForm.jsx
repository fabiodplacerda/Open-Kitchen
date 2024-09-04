import LoadingButton from "@mui/lab/LoadingButton";
import { useContext, useEffect, useState } from "react";
import {
  addRecipe,
  getSingleRecipe,
  updateRecipe,
} from "../../services/recipe.service";
import { UserContext } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import showFeedbackMessage from "../../utils/feedbackMessages";
import { recipeInputValid } from "../../utils/utils";
import { updateUserRecipes } from "../../services/user.service";
import { Button } from "@mui/material";
import { getAllCategories } from "../../services/category.service";

const RecipeForm = ({ action }) => {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [recipe, setRecipe] = useState({
    name: "",
    imgUrl: "",
    description: "",
    author: "",
    category: "",
  });

  const [charCount, setCharCount] = useState(0);

  const [validRecipe, setValidRecipe] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (action === "Add") {
      const updatedRecipe = {
        ...recipe,
        author: loggedUser._id,
      };

      const recipeData = await addRecipe(updatedRecipe, loggedUser.userToken);
      if (recipeData.message && recipeData.message.includes("successfully")) {
        await updateUserRecipes(loggedUser, setLoggedUser);
        setIsLoading(true);
        showFeedbackMessage("success", "Recipe was successfully created");
        setTimeout(() => {
          navigate(`/recipes/${recipeData.newRecipe._id}`);
          setRecipe({
            name: "",
            imgUrl: "",
            description: "",
            author: "",
          });
        }, 1500);
      } else {
        showFeedbackMessage("error", "Failed to create a new recipe", 2000);
      }
    } else {
      const recipeData = await updateRecipe(
        recipeId,
        loggedUser._id,
        recipe,
        loggedUser.userToken
      );

      if (recipeData.message.includes("successfully")) {
        await updateUserRecipes(loggedUser, setLoggedUser);
        showFeedbackMessage(
          "success",
          "Recipe successfully updated, redirecting now..."
        );
        setIsLoading(true);
        setTimeout(() => {
          navigate(`/recipes/${recipeData.updatedRecipe._id}`);
        }, 1500);
      }
    }
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    const recipeData = {
      ...recipe,
      [name]: value,
    };
    const validity = recipeInputValid(
      recipeData.name,
      recipeData.imgUrl,
      recipeData.description
    );
    setValidRecipe(validity);
    setRecipe(recipeData);
  };

  const fetchData = async () => {
    const categoriesData = await getAllCategories();
    setCategories(categoriesData);

    if (action === "Edit") {
      const recipeData = await getSingleRecipe(recipeId);
      const selectedCategory = categoriesData.find(
        (category) => category._id === recipeData.recipe.category
      );
      setRecipe({
        ...recipeData.recipe,
        category: selectedCategory ? selectedCategory._id : "",
      });
    } else {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        category: categoriesData[0]?._id || "",
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [action]);

  return (
    <main
      id="recipe-form-container"
      className="d-flex justify-content-center align-items-center"
    >
      <form
        onSubmit={onSubmitHandler}
        className="recipe-form p-5 d-flex flex-column justify-content-center align-items-center"
      >
        <h2>{action} Recipe</h2>
        <div className="recipe-form-inputs">
          <div className="mb-3 form-floating">
            <input
              name="name"
              type="recipeName"
              className="form-control"
              id="recipeName"
              placeholder="Recipe Name"
              value={recipe.name}
              onChange={(e) => {
                onChangeHandler(e);
                setCharCount(e.target.value.length);
              }}
              disabled={isLoading}
              maxLength="30"
            />
            <label htmlFor="recipeName" className="form-label">
              Recipe Name
            </label>
            <div id="usernameHelpBlock" className="form-text">
              Recipe name must be 3-30 characters long. {30 - charCount}{" "}
              characters left
            </div>
          </div>
          <select
            className="form-select mb-3"
            name="category"
            onChange={onChangeHandler}
            value={recipe.category}
          >
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.categoryName}
              </option>
            ))}
          </select>
          <div className="mb-3 form-floating">
            <input
              name="imgUrl"
              type="url"
              className="form-control"
              id="imgUrl"
              placeholder="https://image-url.com"
              value={recipe.imgUrl}
              onChange={onChangeHandler}
              disabled={isLoading}
            />
            <label htmlFor="imgUrl" className="form-label">
              Image url
            </label>
            <div id="usernameHelpBlock" className="form-text">
              Enter a valid image URL (e.g., https://example.com/image.jpg).
              Must start with http:// or https:// and end with .png, .jpg,
              .jpeg, .gif, .bmp, or .svg.
            </div>
          </div>
          <div className="form-floating">
            <textarea
              className="form-control"
              id="description"
              placeholder="Recipe Description"
              rows="10"
              name="description"
              value={recipe.description}
              onChange={onChangeHandler}
              disabled={isLoading}
            ></textarea>
            <label htmlFor="description">Recipe Description</label>
            <div id="usernameHelpBlock" className="form-text">
              Recipe description must be min 50 characters long.
            </div>
          </div>
        </div>
        <div className="recipe-form-buttons mt-4">
          <LoadingButton
            loading={isLoading}
            loadingIndicator={action === "Add" ? "adding" : "saving"}
            variant="contained"
            type="submit"
            disabled={!validRecipe}
            className="recipe-form-button mx-2"
          >
            {action}
          </LoadingButton>
          <Button
            color="error"
            onClick={() => navigate(-1)}
            className="recipe-form-button mx-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
};

export default RecipeForm;
