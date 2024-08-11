import { useContext, useEffect, useState } from "react";
import {
  createReview,
  deleteReview,
  getReviews,
} from "../../services/review.service";
import { Button, Rating, IconButton } from "@mui/material/";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { UserContext } from "../../context/UserContext";
import AddReviewForm from "./AddReviewForm";
import DeleteIcon from "@mui/icons-material/Delete";
import showFeedbackMessage from "../../utils/feedbackMessages";
import { calculateAverage } from "../../utils/utils";
import { Link } from "react-router-dom";
import ReviewCard from "./ReviewCard";

const Reviews = ({ recipeId, setReviewsAverage }) => {
  const { loggedUser } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [body, setBody] = useState("");
  const [isRating, setIsRating] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const updateAverageRating = (reviewsArr) => {
    const rating = calculateAverage(reviewsArr);
    setReviewsAverage(rating);
  };

  const deleteReviewData = async (reviewId) => {
    try {
      const response = await deleteReview(
        recipeId,
        reviewId,
        loggedUser._id,
        loggedUser.userToken
      );
      if (response === 204) {
        setReviews((prevReviews) => {
          const updatedReviews = prevReviews.filter(
            (review) => review._id !== reviewId
          );
          updateAverageRating(updatedReviews);
          return updatedReviews;
        });
        showFeedbackMessage("success", "Review successfully removed.");
      } else {
        throw new Error("Action failed!");
      }
    } catch (e) {
      showFeedbackMessage("error", e.message);
    }
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
        setReviews((prevReviews) => {
          const updatedReviews = [newReviewResponse.newReview, ...prevReviews];
          updateAverageRating(updatedReviews);
          return updatedReviews;
        });
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
      if (reviewsData) {
        setReviews(reviewsData.reviews.reverse());
        updateAverageRating(reviewsData.reviews);
        setPageLoading(false);
      }
    } catch (e) {}
  };

  useEffect(() => {
    getReviewsData();
  }, []);
  return (
    <>
      {!loggedUser ? (
        <p className="text-white fs-4 my-2">
          {<Link to="/login">Login</Link>} to leave a review
        </p>
      ) : pageLoading ? (
        <p className="text-white fs-4 my-2">Loading reviews...</p>
      ) : (
        !reviews.length && (
          <p className="text-white fs-4 my-2">
            Currently, there are no reviews for this recipe. Be the first to
            leave one!
          </p>
        )
      )}

      {!isRating && loggedUser && !pageLoading && (
        <Button
          variant="contained"
          color="success"
          startIcon={<AddCommentIcon />}
          onClick={() => setIsRating(true)}
          className="mt-4 mb-5"
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
          <ReviewCard
            review={review}
            deleteReviewData={deleteReviewData}
            key={review._id}
          />
        );
      })}
    </>
  );
};

export default Reviews;
