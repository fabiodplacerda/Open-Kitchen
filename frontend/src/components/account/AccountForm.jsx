import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../../context/UserContext";
import { login, register, updateUser } from "../../services/user.service";
import showFeedbackMessage from "../../utils/feedbackMessages";
import { allValidFields, passwordMatchConfirmation } from "../../utils/utils";

import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button } from "@mui/material";

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
      showFeedbackMessage("error", `Error: ${e.message}`, 2500);
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
      showFeedbackMessage("error", `Error: ${e.message}`, 2500);
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
      showFeedbackMessage("error", `Error: ${e.message}`, 2500);
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
    <>
      <main
        className="d-flex justify-content-center align-items-center"
        id="user-form-container"
      >
        <form onSubmit={onSubmitHandler}>
          <Sheet
            sx={{
              width: {
                xs: 300, // 0px to 600px
                sm: 500,
              },
              mx: "auto",
              my: 4,
              py: 3,
              px: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: "sm",
              boxShadow: "md",
            }}
            variant="outlined"
          >
            <div>
              <Typography level="h4" component="h1" className="text-center">
                {action === "Login"
                  ? "Welcome Back !"
                  : action === "Register"
                  ? "Welcome to Open Kitchen"
                  : "You are now editing your profile"}
              </Typography>
            </div>
            {(action === "Register" || action === "Edit") && (
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  placeholder="email@email.com"
                  value={user.email}
                  onChange={onChangeHandler}
                  disabled={action === "Edit" ? true : isLoading}
                />
                {action === "Register" && (
                  <div id="emailHelpBlock" className="form-text">
                    You must provide a valid email
                  </div>
                )}
              </FormControl>
            )}
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                type="username"
                placeholder="username"
                value={user.username}
                onChange={onChangeHandler}
                disabled={action === "Edit" ? true : isLoading}
              />
              {action === "Register" && (
                <div id="usernameHelpBlock" className="form-text">
                  Username must be 3-15 characters long and cannot include
                  special characters or spaces.
                </div>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                // html input attribute
                name="password"
                type="password"
                placeholder="password"
                onChange={onChangeHandler}
                value={user.password}
                aria-describedby="passwordHelpBlock"
                disabled={isLoading}
              />
              {(action === "Register" || action === "Edit") && (
                <div id="passwordHelpBlock" className="form-text">
                  Your password must be 8-20 characters, include at least one
                  uppercase letter and a number, and contain no spaces or
                  special characters.
                </div>
              )}
            </FormControl>
            {action === "Edit" && (
              <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  name="passwordConfirmation"
                  type="password"
                  placeholder="confirm password"
                  onChange={onChangeHandlerPassword}
                  value={confirmPassword}
                  disabled={isLoading}
                />
              </FormControl>
            )}

            <LoadingButton
              sx={{ mt: 1 }}
              loading={isLoading}
              loadingIndicator="Loading"
              variant="contained"
              type="submit"
              disabled={action === "Register" ? !inputsValidity : false}
            >
              {action}
            </LoadingButton>

            {action === "Edit" && (
              <Button
                color="error"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </Button>
            )}

            {action === "Login" ? (
              <>
                <Typography
                  endDecorator={<Link to="/register">Register</Link>}
                  fontSize="sm"
                  sx={{ alignSelf: "center" }}
                >
                  Don't have an account?
                </Typography>
              </>
            ) : (
              action === "Register" && (
                <Typography
                  endDecorator={<Link to="/login">Login</Link>}
                  fontSize="sm"
                  sx={{ alignSelf: "center" }}
                >
                  Have an account?
                </Typography>
              )
            )}
          </Sheet>
        </form>
      </main>
    </>
  );
};

export default AccountForm;
