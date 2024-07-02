import Rating from "@mui/material/Rating";
import { useEffect, useState } from "react";
import { calculateAverage } from "../../utils/utils";

const RecipeCard = ({ recipe }) => {
  const [ratingAverage, setRatingAverage] = useState(0);

  useEffect(() => {
    const rating = calculateAverage(recipe.reviews);
    setRatingAverage(rating);
  }, []);

  return (
    <>
      <img src={recipe.imgUrl} className="card-img-top" alt={recipe.name} />
      <div className="card-body">
        <h5 className="card-title text-center">{recipe.name}</h5>
        <div className="text-center">
          <Rating
            value={ratingAverage}
            readOnly
            precision={0.5}
            className="my-3"
          />
        </div>
        <p className="card-text recipe-card-description">
          {recipe.description.length <= 60
            ? recipe.description
            : `${recipe.description.slice(0, 60)}...`}
        </p>
        <p className="card-text text-center">
          Reviews: {recipe.reviews.length}
        </p>
      </div>
    </>
  );
};

export default RecipeCard;
