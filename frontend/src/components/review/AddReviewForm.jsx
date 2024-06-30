import { Button, Rating, Typography } from "@mui/material/";
import { useState } from "react";

const AddReviewForm = ({
  rating,
  setRating,
  setIsRating,
  postNewReview,
  body,
  setBody,
}) => {
  const [charCount, setCharCount] = useState(0);
  return (
    <div className="review-form m-5 p-3 d-flex flex-column">
      <div className="rating d-flex my-3">
        <Typography sx={{ fontSize: 18 }}>Rating:</Typography>
        <Rating
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
      </div>
      <div className="review-add-description mb-4">
        <label
          htmlFor="exampleFormControlTextarea1"
          id="review-description-label"
        >
          Comment
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setCharCount(e.target.value.length);
          }}
          maxLength="100"
        ></textarea>
        <p className="text-muted">{100 - charCount} characters left</p>
      </div>
      <div className="review-form-buttons align-self-center">
        <Button
          variant="contained"
          color="primary"
          onClick={postNewReview}
          disabled={body.length < 3 || body.length > 100 ? true : false}
          className="mx-2"
        >
          Submit review
        </Button>
        <Button
          color="error"
          onClick={() => {
            setIsRating(false);
            setBody("");
            setRating(1);
          }}
          className="mx-2"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddReviewForm;
