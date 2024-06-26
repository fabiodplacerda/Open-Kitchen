const RecipeCard = ({ recipe }) => {
  return (
    <>
      <img src={recipe.imgUrl} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{recipe.name}</h5>
        <p className="card-text">
          {recipe.description.length <= 60
            ? recipe.description
            : `${recipe.description.slice(0, 60)}...`}
        </p>
        <p className="card-text">comments: {recipe.reviews.length}</p>
      </div>
    </>
  );
};

export default RecipeCard;
