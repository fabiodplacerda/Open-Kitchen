import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { deleteRecipe, getSingleRecipe } from "../../services/recipe.service";
import Reviews from "../review/Reviews";
import ModalBox from "../ModalBox";

// UI components
import { Button, Rating, Skeleton } from "@mui/material";
import showFeedbackMessage from "../../utils/feedbackMessages";
import { updateUserRecipes } from "../../services/user.service";

const SingleRecipe = () => {
  const navigate = useNavigate();
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  const { recipeId } = useParams();

  const [singleRecipe, setSingleRecipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [reviewsAverage, setReviewsAverage] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);

  const handleOpen = () => setOpen(!open);

  const deleteHandler = async () => {
    try {
      const response = await deleteRecipe(
        singleRecipe._id,
        loggedUser._id,
        loggedUser.userToken
      );

      if (response === 204) {
        setIsLoading(true);
        setTimeout(async () => {
          await updateUserRecipes(loggedUser, setLoggedUser);
          navigate("/recipes");
          showFeedbackMessage("success", "Recipe was successfully deleted");
          setIsLoading(false);
        }, 1500);
      } else {
        throw new Error("Action failed");
      }
    } catch (e) {
      console.log(e);
      showFeedbackMessage("error", e.message);
      handleOpen();
    }
  };

  const getSingleRecipeData = async () => {
    try {
      const recipeData = await getSingleRecipe(recipeId);
      if (recipeData.recipe) {
        setPageLoading(false);
        setSingleRecipe(recipeData.recipe);
      }
    } catch (e) {}
  };

  useEffect(() => {
    getSingleRecipeData();
  }, [reviewsAverage]);

  return (
    <main id="single-recipe-main-container">
      <div className="single-recipe-container d-flex justify-content-center align-items-center flex-column">
        <div className="buttons my-4">
          {loggedUser && loggedUser._id === singleRecipe.author && (
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate(`/recipes/${recipeId}/editRecipe`)}
              className="mx-2 button-single-recipe"
            >
              Edit
            </Button>
          )}

          {((loggedUser && loggedUser._id === singleRecipe.author) ||
            (loggedUser && loggedUser.role) === "admin") && (
            <Button
              variant="contained"
              color="error"
              onClick={handleOpen}
              className="mx-2 button-single-recipe"
            >
              Delete
            </Button>
          )}
        </div>
        <div className="single-recipe-card mb-3">
          <div className="row g-0">
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

            <div className="col-lg-4">
              {pageLoading ? (
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: "100%",
                    height: {
                      xs: 400,

                      lg: 500,
                    },
                  }}
                  animation="wave"
                />
              ) : (
                <img
                  src={singleRecipe.imgUrl}
                  alt={singleRecipe.name}
                  className="single-recipe-img"
                  data-testid="recipe-img"
                />
              )}
            </div>

            {pageLoading ? (
              <div className="col-lg-8 d-flex flex-column justify-content-center align-items-center">
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: "50%",
                    height: 35,
                    mt: {
                      xs: 3,
                      lg: 0,
                    },
                  }}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ width: 200, height: 30, mt: 1 }}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ width: "80%", mt: 10 }}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ width: "80%", mt: 1 }}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  sx={{ width: "80%", mt: 1 }}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: "80%",
                    mt: 1,
                    mb: {
                      xs: 2,
                      lg: 0,
                    },
                  }}
                  animation="wave"
                />
              </div>
            ) : (
              <div className="col-lg-8 d-flex flex-column justify-content-center align-items-center">
                <h2 className="text-center">{singleRecipe.name}</h2>
                <Rating
                  value={reviewsAverage}
                  readOnly
                  precision={0.5}
                  className="mb-4"
                />

                <p
                  data-testid="recipe-description"
                  className="single-recipe-text"
                >
                  {singleRecipe.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <Reviews recipeId={recipeId} setReviewsAverage={setReviewsAverage} />
      </div>
    </main>
  );
};

export default SingleRecipe;
