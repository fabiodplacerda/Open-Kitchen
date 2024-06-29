import React from "react";
import { UserContext } from "../src/context/UserContext";
import { MemoryRouter } from "react-router-dom";

const TestWrapper = ({
  children,
  loggedUser = null,
  setLoggedUser = () => {},
}) => (
  <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
    <MemoryRouter>{children}</MemoryRouter>
  </UserContext.Provider>
);

export default TestWrapper;
