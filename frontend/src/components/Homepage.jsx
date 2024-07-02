import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { getRecipes } from "../services/recipe.service";
import RecipeCard from "./recipe/RecipeCard";
import Loader from "./Loader";
import useScreenSize from "../utils/useScreenSize";

const Homepage = () => {
  const [recipesShowCase, setRecipesShowCase] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const screenSize = useScreenSize();
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: screenSize.width > 990 ? 3 : screenSize.width > 670 ? 2 : 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  const getRecipesData = async () => {
    const recipes = await getRecipes();
    if (recipes.message && recipes.message.includes("Request was successful")) {
      const shuffleRecipes = recipes.recipes
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);
      setRecipesShowCase(shuffleRecipes || []);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRecipesData();
  }, []);

  return (
    <main
      id="homepage-main"
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <h1 className="mb-3">Welcome to Open Kitchen</h1>
      <h4 className="mb-5">
        Discover, Share, and Savor Delicious Recipes from Around the World!
      </h4>
      <Link id="homepage-button" to="/recipes">
        Discover new recipes
      </Link>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="slider-container">
          <Slider {...settings}>
            {recipesShowCase.map((recipe) => (
              <div key={recipe._id}>
                <Link
                  data-testid="recipe-card-homepage"
                  className="card recipe-card-homepage mx-auto my-5"
                  to={`/recipes/${recipe._id}`}
                >
                  <RecipeCard recipe={recipe} />
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </main>
  );
};

export default Homepage;
