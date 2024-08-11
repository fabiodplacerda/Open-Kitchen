import { render, screen, waitFor } from "@testing-library/react";
import Reviews from "../src/components/review/Reviews";
import TestWrapper from "./TestWrapper";
import {
  getReviews,
  deleteReview,
  createReview,
} from "../src/services/review.service";
import reviewsData from "./data/reviewsData";
import userData from "./data/userData";
import React, { act } from "react";
import recipesData from "./data/recipesData";
import userEvent from "@testing-library/user-event";

const { expectedReviews, newReview } = reviewsData;
const { recipes } = recipesData;
const { users } = userData;

vi.mock("../src/services/review.service");

describe("Reviews Tests", () => {
  it("should Render the correct amount of reviews", async () => {
    const data = {
      reviews: expectedReviews,
    };
    await act(async () => {
      getReviews.mockResolvedValueOnce(data);

      render(
        <TestWrapper loggedUser={users[0]}>
          <Reviews recipeId={recipes[0]._id} />
        </TestWrapper>
      );
    });
    const reviewsOnPage = screen.getAllByTestId("review-card");
    expect(reviewsOnPage).toHaveLength(expectedReviews.length);
  });
  it("should display a message for user to login to leave a review if no user is logged in", async () => {
    const data = {
      reviews: expectedReviews,
    };
    await act(async () => {
      getReviews.mockResolvedValueOnce(data);

      render(
        <TestWrapper>
          <Reviews recipeId={recipes[0]._id} />
        </TestWrapper>
      );
    });

    const text = screen.getByText(/Login/);

    expect(text).toBeInTheDocument();
  });
  it("should render the review form when user clicks on add review button", async () => {
    const data = {
      reviews: [],
    };
    await act(async () => {
      getReviews.mockResolvedValueOnce(data);

      render(
        <TestWrapper loggedUser={users[0]}>
          <Reviews recipeId={recipes[0]._id} />
        </TestWrapper>
      );
    });

    waitFor(async () => {
      const button = screen.getByRole("button", { name: "Add a review" });
      await userEvent.click(button);
      const reviewForm = screen.getByTestId("review-form");

      expect(reviewForm).toBeInTheDocument();
    });
  });
  it("should delete a review when user clicks the delete button", async () => {
    const data = {
      reviews: expectedReviews,
    };

    await act(async () => {
      getReviews.mockResolvedValueOnce(data);
      deleteReview.mockResolvedValueOnce(204);

      render(
        <TestWrapper loggedUser={users[2]}>
          <Reviews recipeId={recipes[0]._id} setReviewsAverage={vi.fn()} />
        </TestWrapper>
      );
    });

    const deletedReview = screen.queryByText("These pancakes were awesome!");
    const deleteIcon = screen.getByTestId("DeleteIcon");
    await userEvent.click(deleteIcon);

    expect(deleteReview).toHaveBeenCalledWith(
      recipes[0]._id,
      expectedReviews[1]._id,
      users[2]._id,
      users[2].userToken
    );
    expect(deletedReview).not.toBeInTheDocument();
  });
  it("should call add review when user adds a new review", async () => {
    const data = {
      reviews: expectedReviews,
    };

    await act(async () => {
      getReviews.mockResolvedValueOnce(data);

      render(
        <TestWrapper loggedUser={users[2]}>
          <Reviews recipeId={recipes[0]._id} setReviewsAverage={vi.fn()} />
        </TestWrapper>
      );
    });

    const addButton = screen.getByRole("button", { name: "Add a review" });
    await userEvent.click(addButton);
    const reviewBodyInput = screen.getByTestId("review-comment-body");
    const submitButton = screen.getByRole("button", { name: "Submit review" });
    await userEvent.type(reviewBodyInput, "Testing review");
    await userEvent.click(submitButton);

    expect(createReview).toHaveBeenCalledWith(
      recipes[0]._id,
      newReview,
      users[2].userToken
    );
  });
});
