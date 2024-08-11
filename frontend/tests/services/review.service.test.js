import axios from "axios";
import reviewsData from "../data/reviewsData";

const { expectedReviews, newReview } = reviewsData;

import {
  createReview,
  deleteReview,
  getReviews,
} from "../../src/services/review.service";

vi.mock("axios");

describe("Review Services Tests", () => {
  describe("getReviews tests", () => {
    const mockedResolvedUserData = {
      data: expectedReviews,
    };
    it("should make the right data call", async () => {
      axios.get.mockResolvedValueOnce(mockedResolvedUserData);
      await getReviews("667441c68299324f52841990");
      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:4000/recipe/667441c68299324f52841990/reviews`
      );
    });
    it("should return the correct data", async () => {
      axios.get.mockResolvedValueOnce(mockedResolvedUserData);
      const result = await getReviews("667441c68299324f52841990");
      expect(result).toEqual(expectedReviews);
    });
    it("should return an error message if request fails", async () => {
      const error = new Error("test error");
      axios.get.mockRejectedValueOnce(error);
      const result = await getReviews("667441c68299324f52841990");
      expect(result).toBe("test error");
    });
  });
  describe("createReview tests", () => {
    const mockedResolvedUserData = {
      data: newReview,
    };

    const headers = {
      Authorization: `Bearer token`,
    };
    it("should make the right data call", async () => {
      axios.post.mockResolvedValueOnce(mockedResolvedUserData);
      await createReview("667441c68299324f52841990", newReview, "token");
      expect(axios.post).toHaveBeenCalledWith(
        `http://localhost:4000/recipe/667441c68299324f52841990/createReview`,
        newReview,
        { headers }
      );
    });
    it("should return the correct data", async () => {
      axios.post.mockResolvedValueOnce(mockedResolvedUserData);
      const result = await createReview(
        "667441c68299324f52841990",
        newReview,
        "token"
      );
      expect(result).toEqual(newReview);
    });
    it("should return an error message if request fails", async () => {
      const error = {
        response: {
          status: 400,
          statusText: "Bad Request",
        },
      };
      axios.post.mockRejectedValueOnce(error);
      const result = await createReview(
        "667441c68299324f52841990",
        newReview,
        "token"
      );
      expect(result).toEqual({
        status: 400,
        statusText: "Bad Request",
      });
    });
  });
  describe("deleteReview tests", () => {
    const mockedResolvedUserData = {
      status: 204,
    };

    const headers = {
      Authorization: `Bearer token`,
    };
    it("should make the right data call", async () => {
      axios.delete.mockResolvedValueOnce(mockedResolvedUserData);
      await deleteReview(
        "667441c68299324f52841990",
        "667441c68299324f52841991",
        "667441c68299324f52841992",
        "token"
      );
      expect(axios.delete).toHaveBeenCalledWith(
        `http://localhost:4000/recipe/667441c68299324f52841990/reviews/667441c68299324f52841991`,
        { data: { userId: "667441c68299324f52841992" }, headers }
      );
    });
    it("should return the correct data", async () => {
      axios.delete.mockResolvedValueOnce(mockedResolvedUserData);
      const result = await deleteReview(
        "667441c68299324f52841990",
        "667441c68299324f52841991",
        "667441c68299324f52841992",
        "token"
      );
      expect(result).toEqual(204);
    });
    it("should return an error message if request fails", async () => {
      const error = new Error("test error");
      axios.delete.mockRejectedValueOnce(error);
      const result = await deleteReview(
        "667441c68299324f52841990",
        "667441c68299324f52841991",
        "667441c68299324f52841992",
        "token"
      );
      expect(result).toBe("test error");
    });
  });
});
