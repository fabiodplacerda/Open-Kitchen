import {
  allValidFields,
  calculateAverage,
  passwordMatchConfirmation,
  recipeInputValid,
} from "../../src/utils/utils";

describe("Utils Tests", () => {
  describe("passwordMatchConfirmation Tests", () => {
    it("should return true if password match", async () => {
      const expected = true;
      const actual = passwordMatchConfirmation("password", "password");
      expect(actual).toBe(expected);
    });
    it("should return false if don't password match", async () => {
      const expected = false;
      const actual = passwordMatchConfirmation("Password", "password");
      expect(actual).toBe(expected);
    });
  });
  describe("allValidFields Tests", () => {
    it("should return true if all arguments passed are valid", async () => {
      const expected = true;
      const actual = allValidFields("test@email.com", "testUser", "Password1");
      expect(actual).toBe(expected);
    });
    it("should return false if one of the arguments passed is invalid", async () => {
      const expected = false;
      const actual = allValidFields("test@email.com", "test User", "Password1");
      expect(actual).toBe(expected);
    });
  });
  describe("recipeInputValid Tests", () => {
    it("should return true if all arguments passed are valid", async () => {
      const expected = true;
      const actual = recipeInputValid(
        "Test Recipe",
        "https://www.example.com/images/sample.png",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla."
      );
      expect(actual).toBe(expected);
    });
    it("should return false if one of the arguments passed is invalid", async () => {
      const expected = false;
      const actual = recipeInputValid("Test Recipe", "image.com", "Hello!");
      expect(actual).toBe(expected);
    });
  });
  describe("calculateAverage Tests", () => {
    it("should return 0 if reviews array is empty", async () => {
      const expected = 0;
      const actual = calculateAverage([]);
      expect(actual).toEqual(expected);
    });
    it("should return the value of the rating of one review if reviews array only has one review", async () => {
      const expected = 5;
      const actual = calculateAverage([{ rating: 5 }]);
      expect(actual).toEqual(expected);
    });
    it("should return the average of the ratings", async () => {
      const expected = 4;
      const actual = calculateAverage([
        { rating: 5 },
        { rating: 5 },
        { rating: 2 },
      ]);
      expect(actual).toEqual(expected);
    });
  });
});
