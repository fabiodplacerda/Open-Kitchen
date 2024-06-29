import { render, screen } from "@testing-library/react";
import AddRecipe from "../src/components/recipe/AddRecipe";
import TestWrapper from "./TestWrapper";
import usersData from "./data/userData";

import userEvent from "@testing-library/user-event";

const { users } = usersData;

vi.mock("../src/services/recipe.service");

describe("AddRecipe Tests", () => {
  it("should disabled the button when all fields are valid", async () => {
    render(
      <TestWrapper loggedUser={users[0]}>
        <AddRecipe />
      </TestWrapper>
    );

    const recipeNameInput = screen.getByPlaceholderText(/Recipe Name/);
    const recipeImg = screen.getByPlaceholderText("https://image-url.com");
    const recipeDescription = screen.getByPlaceholderText(/Recipe Description/);

    const button = screen.getByText(/add/);

    await userEvent.type(recipeNameInput, "Test Recipe");
    await userEvent.type(
      recipeImg,
      "https://www.example.com/images/sample.png"
    );
    await userEvent.type(
      recipeDescription,
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla."
    );
    expect(button).not.toBeDisabled();
  });
});
