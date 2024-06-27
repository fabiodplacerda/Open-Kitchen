import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { deleteRecipe, getSingleRecipe } from "../services/recipe.service";
import Reviews from "./Reviews";
import ModalBox from "./ModalBox";

// UI components
import { Button } from "@mui/material";
import showFeedbackMessage from "../utils/feedbackMessages";

const SingleRecipe = () => {
  const navigate = useNavigate();
  const { loggedUser } = useContext(UserContext);
  const { recipeId } = useParams();

  const [singleRecipe, setSingleRecipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const deleteHandler = async () => {
    try {
      const response = await deleteRecipe(
        singleRecipe._id,
        loggedUser._id,
        loggedUser.role,
        loggedUser.userToken
      );
      setIsLoading(true);
      setTimeout(() => {
        navigate("/recipes");
        showFeedbackMessage("success", "Recipe was successfully deleted");
        setIsLoading(false);
      }, 1500);
    } catch (e) {
      console.log(e);
    }
  };

  const getSingleRecipeData = async () => {
    try {
      const recipeData = await getSingleRecipe(recipeId);
      setSingleRecipe(recipeData.recipe);
    } catch (e) {}
  };

  useEffect(() => {
    getSingleRecipeData();
  }, []);

  return (
    <>
      {loggedUser && loggedUser._id === singleRecipe.author && (
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate(`/recipes/${recipeId}/editRecipe`)}
        >
          Edit
        </Button>
      )}
      {((loggedUser && loggedUser._id === singleRecipe.author) ||
        loggedUser.role === "admin") && (
        <Button variant="contained" color="error" onClick={handleOpen}>
          Delete
        </Button>
      )}
      <ModalBox
        title={"Delete Recipe"}
        text={
          " Are you certain you want to delete this recipe Please note that this action cannot be reversed?"
        }
        open={open}
        isLoading={isLoading}
        handleOpen={handleOpen}
        deleteFunction={deleteHandler}
      />
      <h2>{singleRecipe.name}</h2>
      <img
        src={singleRecipe.imgUrl}
        alt={singleRecipe.name}
        className="recipe-img"
      />
      <p>{singleRecipe.description}</p>
      <Reviews recipeId={recipeId} />
    </>
  );
};

export default SingleRecipe;
