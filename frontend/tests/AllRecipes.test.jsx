import { render, screen } from "@testing-library/react";
import AllRecipes from "../src/components/recipe/AllRecipes";
import TestWrapper from "./TestWrapper";
import { getRecipes } from "../src/services/recipe.service";
import recipesData from "./data/recipesData";
import { act } from "react";
import usersData from "./data/userData";

const { recipes } = recipesData;
const { users } = usersData;

vi.mock("../src/services/recipe.service");

describe("AllRecipes Tests", () => {
  it("should render the correct amount of recipes", async () => {
    await act(async () => {
      const data = {
        recipes: [...recipes],
      };
      getRecipes.mockResolvedValueOnce(data);

      render(
        <TestWrapper>
          <AllRecipes />
        </TestWrapper>
      );
    });

    const allRecipes = await screen.findAllByTestId(/recipe-card/);

    expect(allRecipes).toHaveLength(recipes.length);
  });
  it("should show a message if there are no recipes to render", async () => {
    await act(async () => {
      const data = {
        recipes: [],
      };
      getRecipes.mockResolvedValueOnce(data);

      render(
        <TestWrapper>
          <AllRecipes />
        </TestWrapper>
      );
    });

    const message = screen.getByText(/Sorry, we don't have any recipes yet./);

    expect(message).toBeInTheDocument();
  });
});
