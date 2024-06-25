import { useParams } from "react-router-dom";

const SingleRecipe = () => {
    const params = useParams()
    console.log(params)
  return <div>SingleRecipe</div>;
};

export default SingleRecipe;
