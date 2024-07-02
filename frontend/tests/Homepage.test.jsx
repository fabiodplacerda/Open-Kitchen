import { render, screen, waitFor } from "@testing-library/react";
import Homepage from "../src/components/Homepage";
import TestWrapper from "./TestWrapper";
import { getRecipes } from "../src/services/recipe.service";
import recipesData from "./data/recipesData";
import { act } from "react";

const { recipes } = recipesData;

// Mocking react-slick
vi.mock("react-slick", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="slick_mock">{children}</div>,
}));
vi.mock("../src/services/recipe.service");
describe("Homepage", () => {
  it("should render the correct amount of recipes", async () => {
    await act(async () => {
      const data = {
        recipes: [...recipes],
      };
      getRecipes.mockResolvedValueOnce(data);

      render(
        <TestWrapper>
          <Homepage />
        </TestWrapper>
      );
    });

    const loadingText = screen.getByText(/Loading content/);

    expect(loadingText).toBeInTheDocument();
  });
});
