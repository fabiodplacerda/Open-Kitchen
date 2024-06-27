import { useContext, useEffect, useState } from "react";
import { login, register, updateUser } from "../services/user.service";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import showFeedbackMessage from "../utils/feedbackMessages";

const AccountForm = ({ action }) => {
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState({ message: "" });

  const [registerSuccessful, setRegisterSuccessful] = useState(false);

  const loginUser = async () => {
    try {
      const userData = await login(user.username, user.password);

      if (userData.message) {
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
      } else if (userData.includes("401")) {
        setLoginSuccessful({ message: "fail" });
      } else {
        setLoginSuccessful({ message: "network" });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const registerUser = async () => {
    console.log("register");
    try {
      const userData = await register(user.email, user.username, user.password);
      setIsLoading(true);
      setRegisterSuccessful(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (e) {
      console.log(e);
    }
  };

  const updateUserData = async () => {
    try {
      const { recipes, savedRecipes, ...userWithoutRecipes } = user;
      console.log(userWithoutRecipes);
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
      }

      console.log(updatedUserData);
    } catch (e) {}
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (action === "Login") {
      await loginUser();
    } else if (action === "Register") {
      await registerUser();
    } else {
      await updateUserData();
    }
    setUser({ email: "", username: "", password: "" });
  };

  const onChangeHandler = (e) => {
    setLoginSuccessful({ message: "" });
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      </div>
      {loginSuccessful.message === "fail" && (
        <p className="text-danger">Password or Username are incorrect.</p>
      )}
      {loginSuccessful.message === "network" && (
        <p className="text-danger">
          Something went wrong please try again later!
        </p>
      )}
      {registerSuccessful && (
        <p className="text-success">The account was registered successfully.</p>
      )}
      <LoadingButton
        loading={isLoading}
        loadingIndicator="Loading"
        variant="contained"
        type="submit"
      >
        {action}
      </LoadingButton>
    </form>
  );
};

export default AccountForm;
