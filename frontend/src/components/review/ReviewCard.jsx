import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { Rating, IconButton } from "@mui/material/";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const ReviewCard = ({ review, deleteReviewData }) => {
  const { loggedUser } = useContext(UserContext);

  dayjs.extend(relativeTime);

  return (
    <div
      className="review-card mb-2 position-relative"
      key={review._id}
      data-testid="review-card"
    >
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
        <p>
          <b>@{review.author.username} </b>
          <span className="text-muted review-date">
            {dayjs(review.date).fromNow()}
          </span>
        </p>
        <Rating value={review.rating} readOnly />
        <p className="mt-2">{review.body}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
