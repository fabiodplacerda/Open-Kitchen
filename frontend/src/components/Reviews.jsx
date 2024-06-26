import { useContext, useEffect, useState } from "react";
import { createReview, getReviews } from "../services/review.service";
import { Button, Rating, Typography } from "@mui/material/";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { UserContext } from "../context/UserContext";

const Reviews = ({ recipeId }) => {
  const { loggedUser } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [body, setBody] = useState("");
  const [isRating, setIsRating] = useState(false);

  const postNewReview = async () => {
    const newReview = {
      rating,
      body,
      author: loggedUser.user._id,
      recipeId,
    };
    try {
      const newReviewResponse = await createReview(
        recipeId,
        newReview,
        loggedUser.userToken
      );

      console.log(newReviewResponse.newReview);

      if (newReviewResponse && newReviewResponse.newReview) {
        console.log(newReviewResponse.newReview);

        setReviews((prevReviews) => [
          newReviewResponse.newReview,
          ...prevReviews,
          ,
        ]);
        setBody("");
        setRating(1);
        setIsRating(false);
      }
    } catch (e) {}
  };

  const getReviewsData = async () => {
    try {
      const reviewsData = await getReviews(recipeId);
      console.log(reviewsData);
      setReviews(reviewsData.reviews.reverse());
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

      {!isRating && loggedUser && (
        <Button
          variant="contained"
          color="success"
          startIcon={<AddCommentIcon />}
          onClick={() => setIsRating(true)}
        >
          Add a review
        </Button>
      )}

      {isRating && (
        <form action="">
          <Typography component="legend">Rating</Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
          <Button variant="contained" color="primary" onClick={postNewReview}>
            Submit review
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setIsRating(false)}
          >
            Cancel
          </Button>
        </form>
      )}
      {reviews.map((review) => {
        return (
          <div className="card" key={review._id}>
            <p>Author: {review.author.username}</p>
            <Rating value={review.rating} readOnly />
            <p>{review.body}</p>
          </div>
        );
      })}
    </>
  );
};

export default Reviews;
