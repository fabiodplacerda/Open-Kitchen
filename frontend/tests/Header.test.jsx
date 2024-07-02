import { screen, render } from "@testing-library/react";
import Header from "../src/components/Header";
import { act } from "react";
import TestWrapper from "./TestWrapper";
import usersData from "./data/userData";
import userEvent from "@testing-library/user-event";
import { logout } from "../src/services/user.service";

const { users } = usersData;

vi.mock("../src/services/user.service");

describe("Header Tests", () => {
  it("should render login or sign up option when no user is logged in", async () => {
    await act(async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );
    });

    const login = screen.getByText(/Login/);
    const register = screen.getByText(/Register/);

    expect(login).toBeInTheDocument();
    expect(register).toBeInTheDocument();
  });
  it("should render account management when users is logged in", async () => {
    await act(async () => {
      render(
        <TestWrapper loggedUser={users[0]}>
          <Header />
        </TestWrapper>
      );
    });

    const myAccount = screen.getByText(/My account/);

    expect(myAccount).toBeInTheDocument();
  });
  it("should render My recipes if user has created recipes", async () => {
    await act(async () => {
      render(
        <TestWrapper loggedUser={users[0]}>
          <Header />
        </TestWrapper>
      );
    });

    const myRecipes = screen.getByText(/My Recipes/);

    expect(myRecipes).toBeInTheDocument();
  });
  it("should call logout if user clicks on logout option on the header", async () => {
    await act(async () => {
      render(
        <TestWrapper loggedUser={users[0]}>
          <Header />
        </TestWrapper>
      );
    });
    const logoutButton = screen.getByText("Logout");
    await userEvent.click(logoutButton);

    expect(logout).toHaveBeenCalled();
  });
});
