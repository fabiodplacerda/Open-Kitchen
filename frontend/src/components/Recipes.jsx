import { useEffect, useState } from "react";
import { getRecipes } from "../services/recipe.service";
import RecipeCard from "./RecipeCard";
import { Link } from "react-router-dom";

const Recipes = () => {
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

  useEffect(() => {
    getRecipesData();
  }, []);

  return (
    <>
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
