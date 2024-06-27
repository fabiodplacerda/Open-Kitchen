import { useContext, useEffect, useState } from "react";
import { getRecipes } from "../services/recipe.service";
import RecipeCard from "./RecipeCard";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const Recipes = () => {
  const { loggedUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);

  console.log(loggedUser);

  const getRecipesData = async () => {
    try {
      const recipesData = await getRecipes();
      setRecipes(recipesData.recipes);
    } catch (e) {
      setError({ message: "Failed to retrieve recipes" });
    }
  };

  useEffect(() => {
    getRecipesData();
  }, []);

  return (
    <>
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
