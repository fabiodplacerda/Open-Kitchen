import { useEffect, useState } from "react";
import { getReviews } from "../services/review.service";

const Reviews = ({ recipeId }) => {
  const [reviews, setReviews] = useState([]);

  const getReviewsData = async () => {
    try {
      const reviewsData = await getReviews(recipeId);
      console.log(reviewsData);
      setReviews(reviewsData.reviews);
    } catch (e) {}
  };

  useEffect(() => {
    getReviewsData();
  }, []);
  return (
    <>
      {!reviews.length && (
        <p>
          Currently, there are no reviews for this recipe. Be the first to leave
          one!
        </p>
      )}
      {reviews.map((review) => {
        return (
          <div className="card">
            <p>Author: {review.author.username}</p>
            <p>Rating: {review.rating}</p>
            <p>{review.body}</p>
          </div>
        );
      })}
    </>
  );
};

export default Reviews;
