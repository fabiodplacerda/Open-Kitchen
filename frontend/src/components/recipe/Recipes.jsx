import { useContext, useEffect, useState } from "react";
import {
  getRecipes,
  getRecipesByAuthorId,
} from "../../services/recipe.service";
import RecipeCard from "./RecipeCard";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Loader from "../Loader";

const Recipes = ({ action }) => {
  const { loggedUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
          <div className="container">
            <div className="row">
              {recipes.map((recipe) => (
                <div className="col-3 mt-5" key={recipe._id}>
                  <Link
                    data-testid="recipe-card"
                    className="card recipe-card"
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
