import { Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { getCurrentUser } from "./services/user.service";

import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Recipes from "./components/Recipes";
import SingleRecipe from "./components/SingleRecipe";
import Homepage from "./components/Homepage";
import AddRecipe from "./components/AddRecipe";
import EditRecipe from "./components/EditRecipe";
import AccountManagement from "./components/AccountManagement";
import AllRecipes from "./components/AllRecipes";
import MyRecipes from "./components/MyRecipes";

function App() {
  const { loggedUser, setLoggedUser } = useContext(UserContext);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setLoggedUser(user);
    }
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/accountManagement" element={<AccountManagement />} />
        <Route path="/recipes" element={<AllRecipes />} />
        <Route path="/myRecipes" element={<MyRecipes />} />
        <Route path="/recipes/:recipeId" element={<SingleRecipe />} />
        <Route path="/recipes/:recipeId/editRecipe" element={<EditRecipe />} />
        <Route path="/recipes/addRecipe" element={<AddRecipe />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
