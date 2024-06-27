import { useContext, useState } from "react";
import { login, register } from "../services/user.service";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const AccountForm = ({ action }) => {
  const { setLoggedUser } = useContext(UserContext);
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
        setLoginSuccessful({ message: "success" });
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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (action === "Login") {
      await loginUser();
    } else if (action === "Register") {
      await registerUser();
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

  return (
    <form onSubmit={onSubmitHandler}>
      {action === "Register" && (
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
      {loginSuccessful.message === "success" && (
        <p className="text-success">Login successful.</p>
      )}
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
        variant="outlined"
        type="submit"
      >
        {action}
      </LoadingButton>
    </form>
  );
};

export default AccountForm;
