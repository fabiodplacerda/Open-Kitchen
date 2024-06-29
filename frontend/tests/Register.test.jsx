import { render, screen } from "@testing-library/react";
import Register from "../src/components/account/Register";
import TestWrapper from "./TestWrapper";
import userEvent from "@testing-library/user-event";

describe("Register Tests", () => {
  it("should render register", async () => {
    render(
      <TestWrapper>
        <Register />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText(/email@email.com/);
    const usernameInput = screen.getByPlaceholderText(/username/);
    const passwordInput = screen.getByPlaceholderText(/password/);
    const button = screen.getByRole("button");

    await userEvent.type(emailInput, "email@test.com");
    await userEvent.type(usernameInput, "testUser");
    await userEvent.type(passwordInput, "Password1");

    expect(button).not.toBeDisabled();
  });
});
