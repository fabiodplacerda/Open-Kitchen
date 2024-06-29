import { render, screen } from "@testing-library/react";
import EditRecipe from "../src/components/recipe/EditRecipe";
import TestWrapper from "./TestWrapper";
import usersData from "./data/userData";
import { getSingleRecipe } from "../src/services/recipe.service";
import { act } from "react";

import userEvent from "@testing-library/user-event";
import recipesData from "./data/recipesData";

const { users } = usersData;
const { recipes } = recipesData;

vi.mock("../src/services/recipe.service");

describe("EditRecipe Tests", () => {
  it("should pre populate the inputs when editing a recipe", async () => {
    const data = {
      recipe: { ...recipes[0] },
    };
    await act(async () => {
      getSingleRecipe.mockResolvedValueOnce(data);
      render(
        <TestWrapper loggedUser={users[0]}>
          <EditRecipe />
        </TestWrapper>
      );
    });

    const recipeNameInput = screen.getByPlaceholderText(/Recipe Name/);
    const recipeImg = screen.getByPlaceholderText("https://image-url.com");
    const recipeDescription = screen.getByPlaceholderText(/Recipe Description/);

    expect(recipeNameInput.value).toEqual("Delicious Pancakes");
    expect(recipeImg.value).toEqual("https://example.com/pancakes.jpg");
    expect(recipeDescription.value).toEqual(
      "A simple recipe for fluffy pancakes."
    );
  });
});
