import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleRecipe } from "../services/recipe.service";
import Reviews from "./Reviews";

const SingleRecipe = () => {
  const { recipeId } = useParams();
  const [singleRecipe, setSingleRecipe] = useState({});

  const getSingleRecipeData = async () => {
    try {
      const recipeData = await getSingleRecipe(recipeId);
      setSingleRecipe(recipeData.recipe);
    } catch (e) {}
  };

  useEffect(() => {
    getSingleRecipeData();
  }, []);

  return (
    <>
      <h2>{singleRecipe.name}</h2>
      <img
        src={singleRecipe.imgUrl}
        alt={singleRecipe.name}
        className="recipe-img"
      />
      <p>{singleRecipe.description}</p>
      <Reviews recipeId={recipeId} />
    </>
  );
};

export default SingleRecipe;
