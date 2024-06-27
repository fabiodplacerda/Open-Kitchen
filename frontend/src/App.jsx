import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Recipes from "./components/Recipes";
import SingleRecipe from "./components/SingleRecipe";
import Homepage from "./components/Homepage";
import { UserContext } from "./context/UserContext";
import AddRecipe from "./components/AddRecipe";
import EditRecipe from "./components/EditRecipe";
import { useContext, useEffect } from "react";
import { getCurrentUser } from "./services/user.service";

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
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:recipeId" element={<SingleRecipe />} />
        <Route path="/recipes/:recipeId/editRecipe" element={<EditRecipe />} />
        <Route path="/recipes/addRecipe" element={<AddRecipe />} />
      </Routes>
    </>
  );
}

export default App;
