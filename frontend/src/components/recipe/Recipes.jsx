import { useContext, useEffect, useState } from "react";
import {
  getRecipes,
  getRecipesByAuthorId,
  getRecipesByName,
} from "../../services/recipe.service";
import RecipeCard from "./RecipeCard";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Loader from "../Loader";
import SearchIcon from "@mui/icons-material/Search";
import showFeedbackMessage from "../../utils/feedbackMessages";

const Recipes = ({ action }) => {
  const { loggedUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getRecipesData = async () => {
    try {
      const recipesData = await getRecipes();
      setRecipes(recipesData.recipes || []);
      setIsLoading(false);
    } catch (e) {
      setError({ message: "Failed to retrieve recipes" });
    }
  };
  const getRecipesByAuthorIdData = async () => {
    try {
      const recipesData = await getRecipesByAuthorId(
        loggedUser._id,
        loggedUser.userToken
      );
      setRecipes(recipesData);
      setIsLoading(false);
    } catch (e) {
      setError({ message: "Failed to retrieve recipes" });
    }
  };

  const getRecipesByNameData = async (e) => {
    e.preventDefault();
    try {
      if (searchTerm.toLowerCase() !== "all" || searchTerm !== "") {
        const response = await getRecipesByName(searchTerm);
        if (!Array.isArray(response)) throw new Error(response);
        setRecipes(response);
      } else {
        await getRecipesData();
      }
      setSearchTerm("");
    } catch (e) {
      showFeedbackMessage("error", e.message);
    }
  };

  const onChangeHandler = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (action === "allRecipes") {
      getRecipesData();
    } else if (action === "myRecipes") {
      getRecipesByAuthorIdData();
    }
  }, []);

  return (
    <main
      id="recipes-container"
      className="position-relative  d-flex flex-column mb-3"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <form
            method="GET"
            onSubmit={getRecipesByNameData}
            className="search-form"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={onChangeHandler}
              placeholder="Search recipe"
              className="search-input"
            />
            <button className="search-button">
              {<SearchIcon sx={{ color: "white", fontSize: "30px" }} />}
            </button>
          </form>
          {!recipes.length && (
            <p className="text-white fs-4 align-self-center justify-se">
              Sorry, we don't have any recipes yet.
            </p>
          )}
          {loggedUser && (
            <Button
              variant="contained"
              color="success"
              startIcon={<AddCircleIcon />}
              onClick={() => navigate("/recipes/addRecipe")}
              className="add-button m-4 add-recipe-button align-self-end"
            >
              Add Recipe
            </Button>
          )}
          <div className=".container-lg">
            <div className="row">
              {recipes.map((recipe) => (
                <div className="col-12 col-md-4 col-lg-3 mt-5" key={recipe._id}>
                  <Link
                    data-testid="recipe-card"
                    className="card recipe-card mx-auto"
                    to={`/recipes/${recipe._id}`}
                  >
                    <RecipeCard recipe={recipe} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Recipes;
