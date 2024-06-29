import { render, screen } from "@testing-library/react";
import MyRecipes from "../src/components/recipe/MyRecipes";
import TestWrapper from "./TestWrapper";

import { getRecipesByAuthorId } from "../src/services/recipe.service";
import recipesData from "./data/recipesData";
import { act } from "react";
import usersData from "./data/userData";

const { recipesByAuthorId } = recipesData;
const { users } = usersData;

vi.mock("../src/services/recipe.service");

describe("MyRecipes Tests", () => {
  it("should render the correct amount of recipes", async () => {
    await act(async () => {
      getRecipesByAuthorId.mockResolvedValueOnce(recipesByAuthorId);

      render(
        <TestWrapper loggedUser={users[0]}>
          <MyRecipes />
        </TestWrapper>
      );
    });

    const allRecipes = await screen.findAllByTestId(/recipe-card/);

    expect(allRecipes).toHaveLength(recipesByAuthorId.length);
  });
});
