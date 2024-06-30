import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Rating, IconButton } from "@mui/material/";

const ReviewCard = ({ review, deleteReviewData }) => {
  const { loggedUser } = useContext(UserContext);
  return (
    <div className="review-card mb-2 position-relative" key={review._id}>
      <div className="review-content">
        {((loggedUser && loggedUser._id === review.author._id) ||
          (loggedUser && loggedUser.role === "admin")) && (
          <IconButton
            onClick={() => deleteReviewData(review._id)}
            className="position-absolute top-0 end-0"
          >
            <DeleteIcon color="error" aria-label="delete" />
          </IconButton>
        )}
        <p className="text-muted">Author: {review.author.username}</p>
        <Rating value={review.rating} readOnly />
        <p className="mt-2">{review.body}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
