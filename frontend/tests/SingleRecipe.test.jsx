import { render, screen } from "@testing-library/react";
import SingleRecipe from "../src/components/recipe/SingleRecipe";
import TestWrapper from "./TestWrapper";
import { getSingleRecipe } from "../src/services/recipe.service";
import recipesData from "./data/recipesData";
import { getReviews } from "../src/services/review.service";
import { act } from "react";
import usersData from "./data/userData";
import reviewsData from "./data/reviewsData";

const { recipes } = recipesData;
const { users } = usersData;
const { reviews } = reviewsData;

vi.mock("../src/services/recipe.service");
vi.mock("../src/services/review.service");

describe("SingleRecipe Tests", () => {
  it("should render a single recipe page with all the correct info", async () => {
    await act(async () => {
      const data = {
        recipe: { ...recipes[0] },
      };
      getSingleRecipe.mockResolvedValueOnce(data);
      getReviews.mockResolvedValueOnce(reviews);

      render(
        <TestWrapper loggedUser={users[0]}>
          <SingleRecipe />
        </TestWrapper>
      );
    });

    const recipeName = screen.getByText(/Delicious Pancakes/);
    const description = screen.getByTestId("recipe-description");
    const imgUrl = screen.getByTestId("recipe-img");

    expect(recipeName.textContent).toEqual("Delicious Pancakes");
    expect(imgUrl.src).toEqual("https://example.com/pancakes.jpg");
    expect(description.textContent).toEqual(
      "A simple recipe for fluffy pancakes."
    );
  });
});
