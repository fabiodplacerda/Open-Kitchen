import LoadingButton from "@mui/lab/LoadingButton";
import { useContext, useEffect, useState } from "react";
import {
  addRecipe,
  getSingleRecipe,
  updateRecipe,
} from "../services/recipe.service";
import { UserContext } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import showFeedbackMessage from "../utils/feedbackMessages";

const RecipeForm = ({ action }) => {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const { loggedUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState({
    name: "",
    imgUrl: "",
    description: "",
    author: "",
  });

  console.log(loggedUser);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (action === "add") {
      const updatedRecipe = {
        ...recipe,
        author: loggedUser._id,
      };
      const recipeData = await addRecipe(updatedRecipe, loggedUser.userToken);
      if (recipeData.message.includes("successfully")) {
        console.log(recipeData.newRecipe);
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
    setRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getRecipeData = async () => {
    try {
      const recipeData = await getSingleRecipe(recipeId);
      setRecipe(recipeData.recipe);
    } catch (e) {}
  };

  useEffect(() => {
    if (action === "edit") {
      getRecipeData();
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="mb-3 form-floating">
        <input
          name="name"
          type="recipeName"
          className="form-control"
          id="recipeName"
          placeholder="Recipe Name"
          value={recipe.name}
          onChange={onChangeHandler}
          disabled={isLoading}
        />
        <label htmlFor="recipeName" className="form-label">
          Recipe Name
        </label>
      </div>

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
      </div>
      <LoadingButton
        loading={isLoading}
        loadingIndicator={action === "add" ? "adding" : "saving"}
        variant="contained"
        type="submit"
      >
        {action}
      </LoadingButton>
      <LoadingButton
        loading={isLoading}
        loadingIndicator={action === "add" ? "adding" : "saving"}
        variant="contained"
        color="error"
        onClick={() => navigate(-1)}
      >
        Cancel
      </LoadingButton>
      <ToastContainer />
    </form>
  );
};

export default RecipeForm;
