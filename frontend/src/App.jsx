import { Route, Routes } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { getCurrentUser } from "./services/user.service";

import Header from "./components/Header";
import Login from "./components/account/Login";
import Register from "./components/account/Register";
import Recipes from "./components/recipe/Recipes";
import SingleRecipe from "./components/recipe/SingleRecipe";
import Homepage from "./components/Homepage";
import AddRecipe from "./components/recipe/AddRecipe";
import EditRecipe from "./components/recipe/EditRecipe";
import AccountManagement from "./components/account/AccountManagement";
import AllRecipes from "./components/recipe/AllRecipes";
import MyRecipes from "./components/recipe/MyRecipes";

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
