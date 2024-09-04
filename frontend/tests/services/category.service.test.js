import axios from "axios";
import { getAllCategories } from "../../src/services/category.service";
import categoriesData from "../data/categoriesData";

vi.mock("axios");

describe("Category Service Tests", () => {
  describe("getAllCategories", () => {
    const mockedResolved = {
      data: categoriesData,
    };

    const categoryUrl = import.meta.env.VITE_APP_CATEGORY;

    it("should make the right data call", async () => {
      axios.get.mockResolvedValueOnce(mockedResolved);

      await getAllCategories();

      expect(axios.get).toHaveBeenCalledWith(`${categoryUrl}/getAllCategories`);
    });
    it("should return the correct data", async () => {
      axios.get.mockResolvedValueOnce(mockedResolved);

      const result = await getAllCategories();

      expect(result).toEqual(categoriesData);
    });
    it("should return a error message if request fails", async () => {
      const error = new Error("test error");
      axios.get.mockRejectedValueOnce(error);

      const result = await getAllCategories();

      expect(result).toBe("test error");
    });
  });
});
