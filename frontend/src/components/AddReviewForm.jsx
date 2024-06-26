import { Button, Rating, Typography } from "@mui/material/";

const AddReviewForm = ({
  rating,
  setRating,
  setIsRating,
  postNewReview,
  body,
  setBody,
}) => {
  return (
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
      <Button
        variant="contained"
        color="primary"
        onClick={postNewReview}
        disabled={body.length < 3 ? true : false}
      >
        Submit review
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() => {
          setIsRating(false);
          setBody("");
          setRating(1);
        }}
      >
        Cancel
      </Button>
    </form>
  );
};

export default AddReviewForm;
