import { useContext, useEffect, useState } from "react";
import {
  createReview,
  deleteReview,
  getReviews,
} from "../services/review.service";
import { Button, Rating, IconButton } from "@mui/material/";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { UserContext } from "../context/UserContext";
import AddReviewForm from "./AddReviewForm";
import DeleteIcon from "@mui/icons-material/Delete";
import showFeedbackMessage from "../utils/feedbackMessages";

const Reviews = ({ recipeId }) => {
  const { loggedUser } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [body, setBody] = useState("");
  const [isRating, setIsRating] = useState(false);

  const deleteReviewData = async (reviewId) => {
    try {
      const response = await deleteReview(
        recipeId,
        reviewId,
        loggedUser._id,
        loggedUser.role,
        loggedUser.userToken
      );
      if (response === 204) {
        setReviews((prevReviews) => {
          return prevReviews.filter((review) => review._id !== reviewId);
        });
        showFeedbackMessage("success", "Review successfully removed.");
      }
    } catch (e) {}
  };

  const postNewReview = async () => {
    const newReview = {
      rating,
      body,
      author: loggedUser._id,
      recipeId,
    };
    try {
      const newReviewResponse = await createReview(
        recipeId,
        newReview,
        loggedUser.userToken
      );

      if (newReviewResponse && newReviewResponse.newReview) {
        showFeedbackMessage("success", "Reviews had been successfully added");
        setReviews((prevReviews) => [
          newReviewResponse.newReview,
          ...prevReviews,
          ,
        ]);
        setBody("");
        setRating(1);
        setIsRating(false);
      } else {
        showFeedbackMessage(
          "error",
          `${newReviewResponse.status}: ${newReviewResponse.statusText}`,
          2000
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getReviewsData = async () => {
    try {
      const reviewsData = await getReviews(recipeId);
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
        <AddReviewForm
          rating={rating}
          setRating={setRating}
          setIsRating={setIsRating}
          postNewReview={postNewReview}
          body={body}
          setBody={setBody}
        />
      )}
      {reviews.map((review) => {
        return (
          <div className="card" key={review._id}>
            {loggedUser && loggedUser._id === review.author._id && (
              <IconButton onClick={() => deleteReviewData(review._id)}>
                <DeleteIcon color="error" aria-label="delete" />
              </IconButton>
            )}
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
