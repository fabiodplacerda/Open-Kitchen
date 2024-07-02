import { render, screen } from "@testing-library/react";
import { act } from "react";
import Login from "../src/components/account/Login";
import TestWrapper from "./TestWrapper";
import userData from "./data/userData";
import userEvent from "@testing-library/user-event";
import { login } from "../src/services/user.service";

vi.mock("../src/services/user.service");

const { users } = userData;

describe("Login Tests", () => {
  it("should call login", async () => {
    await act(async () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );
    });

    const usernameInput = screen.getByPlaceholderText("username");
    const passwordInput = screen.getByPlaceholderText("password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    await userEvent.type(passwordInput, users[2].password);
    await userEvent.type(usernameInput, users[2].username);
    await userEvent.click(loginButton);

    expect(login).toHaveBeenCalledWith(users[2].username, users[2].password);
  });
});
