import LoadingButton from "@mui/lab/LoadingButton";
import { useContext, useEffect, useState } from "react";
import { addRecipe } from "../services/recipe.service";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const RecipeForm = ({ action }) => {
  const navigate = useNavigate();
  const { loggedUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [feedBackMessage, setFeedBackMessage] = useState(null);
  const [recipe, setRecipe] = useState({
    name: "",
    imgUrl: "",
    description: "",
    author: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (action === "add") {
      const updatedRecipe = {
        ...recipe,
        author: loggedUser.user._id,
      };

      const recipeData = await addRecipe(updatedRecipe, loggedUser.userToken);

      if (recipeData.message.includes("successfully")) {
        console.log(recipeData.newRecipe);
        setIsLoading(true);
        setFeedBackMessage({ message: "Recipe was successfully created" });
        setRecipe({
          name: "",
          imgUrl: "",
          description: "",
          author: "",
        });
        setTimeout(() => {
          navigate(`/recipes/${recipeData.newRecipe._id}`);
        }, 1500);
      } else {
        setFeedBackMessage({
          message: "Failed to create a new recipe",
        });
      }
    }
  };

  const onChangeHandler = (e) => {
    setFeedBackMessage(null);
    const { name, value } = e.target;
    setRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
        ></textarea>
        <label htmlFor="description">Recipe Description</label>
      </div>
      {feedBackMessage && (
        <p
          className={
            feedBackMessage.message.includes("successfully")
              ? "text-success"
              : "text-danger"
          }
        >
          {feedBackMessage.message}
        </p>
      )}
      <LoadingButton
        loading={isLoading}
        loadingIndicator={action === "add" ? "adding" : "saving"}
        variant="outlined"
        type="submit"
      >
        {action}
      </LoadingButton>
    </form>
  );
};

export default RecipeForm;
