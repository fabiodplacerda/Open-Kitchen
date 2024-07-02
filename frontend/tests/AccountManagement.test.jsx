import { render, screen } from "@testing-library/react";
import { act } from "react";
import AccountManagement from "../src/components/account/AccountManagement";
import TestWrapper from "./TestWrapper";
import userData from "./data/userData";
import userEvent from "@testing-library/user-event";
import { updateUser } from "../src/services/user.service";

vi.mock("../src/services/user.service");

const { users } = userData;

describe("AccountManagement Tests", () => {
  it("should render the form with pre populated values for email and username", async () => {
    await act(async () => {
      render(
        <TestWrapper loggedUser={users[0]}>
          <AccountManagement />
        </TestWrapper>
      );
    });

    const emailInput = screen.getByPlaceholderText("email@email.com");
    const usernameInput = screen.getByPlaceholderText("username");

    expect(emailInput.value).toEqual(users[0].email);
    expect(usernameInput.value).toEqual(users[0].username);
  });
  it("should call update when user clicks the edit button", async () => {
    const { recipes, savedRecipes, ...userWithoutRecipes } = users[2];
    userWithoutRecipes.password = "Password123";
    await act(async () => {
      render(
        <TestWrapper loggedUser={users[2]}>
          <AccountManagement />
        </TestWrapper>
      );
    });

    const emailInput = screen.getByPlaceholderText("email@email.com");
    const usernameInput = screen.getByPlaceholderText("username");
    const passwordInput = screen.getByPlaceholderText("password");
    const confirmationInput = screen.getByPlaceholderText("confirm password");
    const editButton = screen.getByRole("button", { name: "Edit" });

    await userEvent.type(passwordInput, "Password123");
    await userEvent.type(confirmationInput, "Password123");
    await userEvent.click(editButton);

    expect(updateUser).toHaveBeenCalledWith(
      users[2]._id,
      userWithoutRecipes,
      users[2].userToken
    );
  });
});
