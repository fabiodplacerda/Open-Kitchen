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

const Recipes = ({ action }) => {
  const { loggedUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const getRecipesData = async () => {
    try {
      const recipesData = await getRecipes();
      setRecipes(recipesData.recipes);
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
    <>
      {!recipes.length && <p>Sorry, we don't have any recipes yet.</p>}
      {loggedUser && (
        <Button
          variant="contained"
          color="success"
          startIcon={<AddCircleIcon />}
          onClick={() => navigate("/recipes/addRecipe")}
        >
          Add a new Recipe
        </Button>
      )}
      {recipes.map((recipe) => {
        return (
          <Link
            data-testid="recipe-card"
            className="card recipe-card"
            key={recipe._id}
            to={`/recipes/${recipe._id}`}
          >
            <RecipeCard recipe={recipe} />
          </Link>
        );
      })}
    </>
  );
};

export default Recipes;
