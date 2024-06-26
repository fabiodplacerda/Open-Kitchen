import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Recipes from "./components/Recipes";
import SingleRecipe from "./components/SingleRecipe";
import Homepage from "./components/Homepage";
import { UserProvider } from "./context/UserContext";
import AddRecipe from "./components/AddRecipe";
import EditRecipe from "./components/EditRecipe";

function App() {
  return (
    <>
      <UserProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:recipeId" element={<SingleRecipe />} />
          <Route
            path="/recipes/:recipeId/editRecipe"
            element={<EditRecipe />}
          />
          <Route path="/recipes/addRecipe" element={<AddRecipe />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
