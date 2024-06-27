import { useContext, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { logout } from "../services/user.service";

const Header = () => {
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  const logoutHandler = () => {
    logout();
    setLoggedUser(null);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <NavLink to="/">
          <img
            src={"/assets/logo/png/logo-no-background.png"}
            alt="Logo"
            id="page-logo"
          />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/recipes">
                Recipes
              </NavLink>
            </li>
            {loggedUser && loggedUser.recipes.length > 0 && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/recipes">
                  My Recipes
                </NavLink>
              </li>
            )}

            {loggedUser && loggedUser.savedRecipes.length > 0 && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/recipes">
                  My Recipes
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {!loggedUser ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  My account
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/user/accountManagement"
                    >
                      Manage
                    </NavLink>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      onClick={logoutHandler}
                      to="/login"
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
