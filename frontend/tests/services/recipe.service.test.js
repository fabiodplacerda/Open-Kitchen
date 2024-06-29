import axios from "axios";
import recipesData from "../data/recipesData";
import {
  addRecipe,
  deleteRecipe,
  getRecipes,
  getSingleRecipe,
  updateRecipe,
  getRecipesByAuthorId,
} from "../../src/services/recipe.service";

const { recipes, singleRecipe, recipesByAuthorId } = recipesData;

vi.mock("axios");

describe("Recipe Services Tests", () => {
  describe("getSingleRecipe tests", () => {
    const mockedResolvedUserData = {
      data: recipes[0],
    };
    it("should make the right data call", async () => {
      axios.get.mockResolvedValueOnce(mockedResolvedUserData);

      await getSingleRecipe(recipes[0]._id);

      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:4000/recipe/${recipes[0]._id}`
      );
    });
    it("should return the correct data", async () => {
      axios.get.mockResolvedValueOnce(mockedResolvedUserData);

      const result = await getSingleRecipe();

      expect(result).toEqual(singleRecipe);
    });

    it("should return an error message if request fails", async () => {
      const error = new Error("test error");
      axios.get.mockRejectedValueOnce(error);

      const result = await getSingleRecipe();

      expect(result).toBe("test error");
    });
  });
  describe("getRecipes tests", () => {
    const mockedResolvedUserData = {
      data: recipes,
    };
    it("should make the right data call", async () => {
      axios.get.mockResolvedValueOnce(mockedResolvedUserData);

      await getRecipes();

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:4000/recipe/getAllRecipes"
      );
    });
    it("should return the correct data", async () => {
      axios.get.mockResolvedValueOnce(mockedResolvedUserData);

      const result = await getRecipes();

      expect(result).toEqual(recipes);
    });

    it("should return an error message if request fails", async () => {
      const error = new Error("test error");
      axios.get.mockRejectedValueOnce(error);

      const result = await getRecipes();

      expect(result).toBe("test error");
    });
  });
  describe("addRecipe tests", () => {
    const mockedResolvedUserData = {
      data: singleRecipe,
    };
    const headers = {
      Authorization: `Bearer token`,
    };
    it("should make the right data call", async () => {
      axios.post.mockResolvedValueOnce(mockedResolvedUserData);

      await addRecipe(singleRecipe, "token");

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:4000/recipe/createRecipe",
        singleRecipe,
        { headers }
      );
    });
    it("should return the correct data", async () => {
      axios.post.mockResolvedValueOnce(mockedResolvedUserData);

      const result = await addRecipe(singleRecipe, "token");

      expect(result).toEqual(singleRecipe);
    });

    it("should return an error message if request fails", async () => {
      const error = new Error("test error");
      axios.post.mockRejectedValueOnce(error);

      const result = await addRecipe(singleRecipe, "token");

      expect(result).toBe("test error");
    });
  });
  describe("updateRecipe tests", () => {
    const mockedResolvedUserData = {
      data: singleRecipe,
    };
    const headers = {
      Authorization: `Bearer token`,
    };

    it("should make the right data call", async () => {
      axios.put.mockResolvedValueOnce(mockedResolvedUserData);

      await updateRecipe(
        singleRecipe._id,
        singleRecipe.author,
        singleRecipe,
        "token"
      );

      expect(axios.put).toHaveBeenCalledWith(
        `http://localhost:4000/recipe/${singleRecipe._id}`,
        { userId: singleRecipe.author, updates: { ...singleRecipe } },
        { headers }
      );
    });
    it("should return the correct data", async () => {
      axios.put.mockResolvedValueOnce(mockedResolvedUserData);

      const result = await updateRecipe(
        singleRecipe._id,
        singleRecipe.author,
        singleRecipe,
        "token"
      );

      expect(result).toEqual(singleRecipe);
    });

    it("should return an error message if request fails", async () => {
      const error = new Error("test error");
      axios.put.mockRejectedValueOnce(error);

      const result = await updateRecipe(
        singleRecipe._id,
        singleRecipe.author,
        singleRecipe,
        "token"
      );

      expect(result).toBe("test error");
    });
  });
  describe("deleteRecipe tests", () => {
    const mockedResolvedUserData = {
      status: 204,
    };
    const headers = {
      Authorization: `Bearer token`,
    };

    it("should make the right data call", async () => {
      axios.delete.mockResolvedValueOnce(mockedResolvedUserData);

      await deleteRecipe(
        singleRecipe._id,
        singleRecipe.author,
        "user",
        "token"
      );

      expect(axios.delete).toHaveBeenCalledWith(
        `http://localhost:4000/recipe/${singleRecipe._id}`,
        { data: { userId: singleRecipe.author, role: "user" }, headers }
      );
    });
    it("should return the correct data", async () => {
      axios.delete.mockResolvedValueOnce(mockedResolvedUserData);

      const result = await deleteRecipe(
        singleRecipe._id,
        singleRecipe.author,
        "user",
        "token"
      );

      expect(result).toEqual(204);
    });

    it("should return an error message if request fails", async () => {
      const error = new Error("test error");
      axios.delete.mockRejectedValueOnce(error);

      const result = await deleteRecipe(
        singleRecipe._id,
        singleRecipe.author,
        "user",
        "token"
      );

      expect(result).toBe("test error");
    });
  });
  describe("getRecipesByAuthorId tests", () => {
    const mockedResolvedUserData = {
      data: recipesByAuthorId,
    };
    const headers = {
      Authorization: `Bearer token`,
    };

    it("should make the right data call", async () => {
      axios.get.mockResolvedValueOnce(mockedResolvedUserData);

      await getRecipesByAuthorId("667441c68299324f52841985", "token");

      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:4000/recipe/author/667441c68299324f52841985`,
        { headers }
      );
    });
    it("should return the correct data", async () => {
      axios.get.mockResolvedValueOnce(mockedResolvedUserData);

      const result = await getRecipesByAuthorId(
        "667441c68299324f52841985",
        "token"
      );

      expect(result).toEqual(recipesByAuthorId);
    });

    it("should return an error message if request fails", async () => {
      const error = new Error("test error");
      axios.get.mockRejectedValueOnce(error);

      const result = await getRecipesByAuthorId(
        "667441c68299324f52841985",
        "token"
      );

      expect(result).toBe("test error");
    });
  });
});
