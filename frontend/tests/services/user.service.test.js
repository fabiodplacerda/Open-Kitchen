import axios from "axios";
import {
  getSingleUser,
  login,
  register,
  updateUser,
} from "../../src/services/user.service";
import usersData from "../data/userData";

const { users, newUser, expectedResults } = usersData;

vi.mock("axios");

describe("User Services Tests", () => {
  describe("Register tests", () => {
    const mockedResolvedUserData = {
      data: newUser,
      status: 201,
    };
    it("should make the right data call", async () => {
      axios.post.mockResolvedValueOnce(mockedResolvedUserData);

      await register(newUser.email, newUser.username, newUser.password);

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:4000/user/createAccount",
        newUser
      );
    });
    it("should return the correct data", async () => {
      axios.post.mockResolvedValueOnce(mockedResolvedUserData);

      const result = await register(
        newUser.email,
        newUser.username,
        newUser.password
      );

      expect(result).toBe(201);
    });

    it("should return an error message if request fails", async () => {
      const error = {
        response: {
          data: {
            message: "dup key",
          },
        },
      };
      axios.post.mockRejectedValueOnce(error);

      const result = await register(
        newUser.email,
        newUser.username,
        newUser.password
      );

      expect(result).toEqual({
        status: 500,
        message: "Username or Email already in use",
      });
    });
  });
  describe("Login tests", () => {
    const mockedResolvedUserData = {
      data: users[0],
    };
    it("should make the right data call", async () => {
      axios.post.mockResolvedValueOnce(mockedResolvedUserData);

      await login("user1", "Password1");

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:4000/user/login",
        { username: "user1", password: "Password1" }
      );
    });
    it("should return the correct data", async () => {
      axios.post.mockResolvedValueOnce(mockedResolvedUserData);

      const result = await login("user1", "Password1");

      expect(result).toEqual(expectedResults);
    });

    it("should return an error message if request fails", async () => {
      const error = {
        response: {
          status: 400,
          statusText: "test error",
        },
      };
      axios.post.mockRejectedValueOnce(error);

      const result = await login("user1", "Password1");

      expect(result).toEqual({
        status: 400,
        message: "test error",
      });
    });
  });
  describe("UpdateUser tests", () => {
    const mockedResolvedUserData = {
      data: users[0],
    };

    const updates = {
      password: "NewPassword1",
    };

    const headers = {
      Authorization: `Bearer token`,
    };
    it("should make the right data call", async () => {
      axios.put.mockResolvedValueOnce(mockedResolvedUserData);

      await updateUser(users[0]._id, updates, "token");

      expect(axios.put).toHaveBeenCalledWith(
        `http://localhost:4000/user/${users[0]._id}`,
        updates,
        { headers }
      );
    });
    it("should return the correct data", async () => {
      axios.put.mockResolvedValueOnce(mockedResolvedUserData);

      const result = await updateUser(users[0]._id, updates, "token");

      expect(result).toEqual(expectedResults);
    });

    it("should return an error message if request fails", async () => {
      const error = {
        response: {
          status: 400,
          statusText: "test error",
        },
      };
      axios.put.mockRejectedValueOnce(error);

      const result = await updateUser(users[0]._id, updates, "token");

      expect(result).toEqual({
        status: 400,
        message: "test error",
      });
    });
  });
  describe("GetSingleUser tests", () => {
    const mockedResolvedUserData = {
      data: users[0],
    };

    const headers = {
      Authorization: `Bearer token`,
    };
    it("should make the right data call", async () => {
      axios.get.mockResolvedValueOnce(mockedResolvedUserData);

      await getSingleUser(users[0]._id, "token");

      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:4000/user/${users[0]._id}`,
        { headers }
      );
    });
    it("should return the correct data", async () => {
      axios.get.mockResolvedValueOnce(mockedResolvedUserData);

      const result = await getSingleUser(users[0]._id, "token");

      expect(result).toEqual(expectedResults);
    });

    it("should return an error message if request fails", async () => {
      const error = new Error("test error");
      axios.get.mockRejectedValueOnce(error);

      const result = await getSingleUser(users[0]._id, "token");

      expect(result).toBe("test error");
    });
  });
});
