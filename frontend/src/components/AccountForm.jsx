import { useContext, useEffect, useState } from "react";
import { login, register, updateUser } from "../services/user.service";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import showFeedbackMessage from "../utils/feedbackMessages";
import { allValidFields, passwordMatchConfirmation } from "../utils/utils";

const AccountForm = ({ action }) => {
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputsValidity, setInputsValidity] = useState(false);

  const loginUser = async () => {
    try {
      const userData = await login(user.username, user.password);

      if (userData.token) {
        const { user, token } = userData;
        const storeUser = {
          ...user,
          userToken: token,
        };
        setLoggedUser(storeUser);
        setIsLoading(true);
        showFeedbackMessage("success", "Login successful.");
        setTimeout(() => {
          navigate("/recipes");
        }, 1500);
      } else if (userData.status && userData.status === 401) {
        showFeedbackMessage("error", "Username or password don't match.", 2500);
      } else {
        showFeedbackMessage("error", `Error: ${userData.message}`, 2500);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const registerUser = async () => {
    try {
      const userData = await register(user.email, user.username, user.password);
      if (userData === 201) {
        setIsLoading(true);
        showFeedbackMessage(
          "success",
          "The account was registered successfully."
        );
        setTimeout(() => {
          navigate("/login");
          setUser({ email: "", username: "", password: "" });
        }, 1500);
      } else {
        showFeedbackMessage("error", `Error: ${userData.message}`, 2500);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateUserData = async () => {
    try {
      const { recipes, savedRecipes, ...userWithoutRecipes } = user;
      const updatedUserData = await updateUser(
        loggedUser._id,
        userWithoutRecipes,
        loggedUser.userToken
      );

      if (updatedUserData.message.includes("successfully")) {
        setIsLoading(true);
        showFeedbackMessage("success", "Password successfully updated");
        setTimeout(() => {
          navigate("/recipes");
        }, 1500);
      } else if (updatedUserData.status === 400) {
        showFeedbackMessage("error", "400: Invalid password", 2000);
        setConfirmPassword("");
        setUser((prevState) => ({ ...prevState, password: "" }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (action === "Login") {
      await loginUser();
    } else if (action === "Register") {
      await registerUser();
    } else {
      const passwordMatch = passwordMatchConfirmation(
        user.password,
        confirmPassword
      );
      if (passwordMatch) {
        await updateUserData();
      } else {
        showFeedbackMessage("error", "Passwords don't match", 2500);
        setConfirmPassword("");
        setUser((prevState) => ({ ...prevState, password: "" }));
      }
    }
    // setUser({ email: "", username: "", password: "" });
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    const newUserState = {
      ...user,
      [name]: value,
    };
    if (action === "Register") {
      const isValid = allValidFields(
        newUserState.email,
        newUserState.username,
        newUserState.password
      );
      setInputsValidity(isValid);
    }

    setUser(newUserState);
  };

  const onChangeHandlerPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  useEffect(() => {
    if (action === "Edit" && loggedUser) {
      setUser({ ...loggedUser, password: "" });
    }
  }, [loggedUser]);

  return (
    <form onSubmit={onSubmitHandler}>
      {(action === "Register" || action === "Edit") && (
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            name="email"
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="email@email.com"
            value={user.email}
            onChange={onChangeHandler}
            disabled={action === "Edit" ? true : false}
          />
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          name="username"
          type="username"
          className="form-control"
          id="username"
          placeholder="username"
          value={user.username}
          onChange={onChangeHandler}
          disabled={action === "Edit" ? true : false}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          name="password"
          type="password"
          className="form-control"
          id="password"
          placeholder="password"
          onChange={onChangeHandler}
          value={user.password}
        />
        {(action === "Register" || action === "Edit") && (
          <div id="passwordHelpBlock" className="form-text">
            Your password must be 8-20 characters long, contain letters and
            numbers, and must not contain spaces, special characters, or emoji.
          </div>
        )}
      </div>
      {action === "Edit" && (
        <div className="mb-3">
          <label htmlFor="passwordConfirmation" className="form-label">
            Confirm Password
          </label>
          <input
            name="passwordConfirmation"
            type="password"
            className="form-control"
            id="passwordConfirmation"
            placeholder="confirm password"
            onChange={onChangeHandlerPassword}
            value={confirmPassword}
          />
        </div>
      )}

      <LoadingButton
        loading={isLoading}
        loadingIndicator="Loading"
        variant="contained"
        type="submit"
        disabled={action === "Register" ? !inputsValidity : false}
      >
        {action}
      </LoadingButton>
    </form>
  );
};

export default AccountForm;
