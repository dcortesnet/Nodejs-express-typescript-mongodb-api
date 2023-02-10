import * as authService from "../src/services/auth.service";
import * as userRepository from "../src/repositories/user.repository";
import {
  generateToken,
  generateUserData,
  generateUserPayload,
  generateUsersData,
} from "./utils/generate";
import request from "supertest";
import { app } from "../src/app";
import mongoose from "mongoose";

beforeAll((done) => {
  if (!mongoose.connection.db) {
    mongoose.connection.on("connected", done);
  } else {
    done();
  }
});

afterEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("UserService", () => {
  describe("getAllUsers", () => {
    test("should return empty array", async () => {
      const token = generateToken();
      const spy = jest
        .spyOn(userRepository, "getAllUsers")
        .mockResolvedValueOnce([]);

      const { body } = await request(app)
        .get("/api/v1/users")
        .set("auth", token)
        .send({})
        .expect(200);

      expect(body.usersData).toEqual([]);
      expect(spy).toHaveBeenCalledWith();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("should return users list", async () => {
      const token = generateToken();
      const id = mongoose.Types.ObjectId();
      const userData = generateUsersData(2);
      const spy = jest
        .spyOn(userRepository, "getAllUsers")
        .mockResolvedValueOnce(userData);

      const { body } = await request(app)
        .get("/api/v1/users")
        .set("auth", token)
        .send({})
        .expect(200);

      expect(body.usersData).toEqual(userData);
      expect(spy).toHaveBeenCalledWith();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("should return error because of invalid token", async () => {
      const token = generateToken();
      const { body } = await request(app)
        .get("/api/v1/users")
        .set("auth", token + "123")
        .send({})
        .expect(400);
    });

    test("should return error because of no token provided", async () => {
      const { body } = await request(app)
        .get("/api/v1/users")
        .send({})
        .expect(403);
    });
  });

  describe("registerUser", () => {
    test("should add user to db", async () => {
      const payload = generateUserPayload();
      const userData = generateUserData(payload);

      const spy2 = jest
        .spyOn(userRepository, "getUserByEmail")
        .mockResolvedValueOnce(null);
      const spy3 = jest
        .spyOn(userRepository, "getUserByUsername")
        .mockResolvedValueOnce(null);

      const spy = jest
        .spyOn(userRepository, "createUser")
        .mockResolvedValueOnce(userData);

      const { body } = await request(app)
        .post("/api/v1/users")
        .send(payload)
        .expect(201);

      expect(body.userData.email).toEqual(payload.email);
      expect(body.userData.username).toEqual(payload.username);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("should return error because email already exists", async () => {
      const payload = generateUserPayload();
      const userData = generateUserData(payload);
      const spy = jest
        .spyOn(userRepository, "getUserByEmail")
        .mockResolvedValueOnce(userData);

      const { body } = await request(app)
        .post("/api/v1/users")
        .send(payload)
        .expect(409);

      expect(spy).toHaveBeenCalledWith(payload.email);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("should return error because username already exists", async () => {
      const payload = generateUserPayload();
      const userData = generateUserData(payload);
      const spy1 = jest
        .spyOn(userRepository, "getUserByEmail")
        .mockResolvedValueOnce(null);

      const spy = jest
        .spyOn(userRepository, "getUserByUsername")
        .mockResolvedValueOnce(userData);

      const { body } = await request(app)
        .post("/api/v1/users")
        .send(payload)
        .expect(409);

      expect(spy).toHaveBeenCalledWith(payload.username);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("should return error because email is invalid", async () => {
      const payload = generateUserPayload();
      payload.email = "inv";

      const { body } = await request(app)
        .post("/api/v1/users")
        .send(payload)
        .expect(400);
    });

    test("should return error because username is invalid", async () => {
      const payload = generateUserPayload();
      payload.username = "inv";

      const { body } = await request(app)
        .post("/api/v1/users")
        .send(payload)
        .expect(400);
    });

    test("should return error because password is invalid", async () => {
      const payload = generateUserPayload();
      payload.password = "inv";

      const { body } = await request(app)
        .post("/api/v1/users")
        .send(payload)
        .expect(400);
    });
  });

  describe("getUserById", () => {
    test("should return user from db", async () => {
      const token = generateToken();
      const _id = mongoose.Types.ObjectId();
      const userData = generateUserData({ _id });
      const spy = jest
        .spyOn(userRepository, "getUserById")
        .mockResolvedValueOnce(userData);

      const { body } = await request(app)
        .get("/api/v1/users/" + _id)
        .set("auth", token)
        .expect(200);

      expect(body.userData.email).toEqual(userData.email);
      expect(spy).toHaveBeenCalledWith(_id.toString());
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("should return error because of invalid id", async () => {
      const token = generateToken();
      const _id = "123";

      const { body } = await request(app)
        .get("/api/v1/users/" + _id)
        .set("auth", token)
        .expect(400);
    });

    test("should return error because of invalid token", async () => {
      const token = generateToken();
      const _id = mongoose.Types.ObjectId();
      const { body } = await request(app)
        .get("/api/v1/users/" + _id)
        .set("auth", token + "123")
        .send({})
        .expect(400);
    });

    test("should return error because of no token provided", async () => {
      const _id = mongoose.Types.ObjectId();
      const { body } = await request(app)
        .get("/api/v1/users/" + _id)
        .send({})
        .expect(403);
    });
  });

  describe("deleteUser", () => {
    test("should delete user from db", async () => {
      const token = generateToken();
      const _id = mongoose.Types.ObjectId();
      const userData = generateUserData({ _id });
      const spy = jest
        .spyOn(userRepository, "getUserById")
        .mockResolvedValueOnce(userData);
      const spy1 = jest
        .spyOn(userRepository, "deleteUser")
        .mockResolvedValueOnce({ ok: 1, n: 0 });

      const { body } = await request(app)
        .delete("/api/v1/users/" + _id)
        .set("auth", token)
        .send({})
        .expect(200);

      expect(spy).toBeCalledWith(_id.toString());
      expect(spy).toBeCalledTimes(1);
      expect(spy1).toBeCalledWith(_id);
      expect(spy1).toBeCalledTimes(1);
    });

    test("should return error because of invalid id", async () => {
      const token = generateToken();
      const _id = mongoose.Types.ObjectId();

      const { body } = await request(app)
        .delete("/api/v1/users/" + _id + "123")
        .set("auth", token)
        .send({})
        .expect(400);
    });

    test("should return error because of not founding user", async () => {
      const token = generateToken();
      const _id = mongoose.Types.ObjectId();
      const spy = jest
        .spyOn(userRepository, "getUserById")
        .mockResolvedValueOnce(null);

      const { body } = await request(app)
        .delete("/api/v1/users/" + _id)
        .set("auth", token)
        .send({})
        .expect(404);

      expect(spy).toBeCalledWith(_id.toString());
      expect(spy).toBeCalledTimes(1);
    });

    test("should return error because of invalid token", async () => {
      const token = generateToken();
      const _id = mongoose.Types.ObjectId();
      const { body } = await request(app)
        .delete("/api/v1/users/" + _id)
        .set("auth", token + "123")
        .send({})
        .expect(400);
    });

    test("should return error because of no token provided", async () => {
      const _id = mongoose.Types.ObjectId();
      const { body } = await request(app)
        .delete("/api/v1/users/" + _id)
        .send({})
        .expect(403);
    });
  });

  describe("updateUser", () => {
    test("should update user", async () => {
      const token = generateToken();
      const _id = mongoose.Types.ObjectId();
      const userData = generateUserData({ _id });
      const payload = generateUserPayload();
      const spy = jest
        .spyOn(userRepository, "getUserById")
        .mockResolvedValueOnce(userData);
      const spy1 = jest
        .spyOn(userRepository, "updateUser")
        .mockResolvedValueOnce({ n: 1, nModified: 1, ok: 1 });

      const { body } = await request(app)
        .put("/api/v1/users/" + _id)
        .set("auth", token)
        .send(payload)
        .expect(200);

      expect(spy).toBeCalledWith(_id.toString());
      expect(spy).toBeCalledTimes(1);
      expect(spy1).toBeCalledTimes(1);
    });

    test("should return error because user not found", async () => {
      const token = generateToken();
      const _id = mongoose.Types.ObjectId();
      const payload = generateUserPayload();
      const spy = jest
        .spyOn(userRepository, "getUserById")
        .mockResolvedValueOnce(null);

      const { body } = await request(app)
        .put("/api/v1/users/" + _id)
        .set("auth", token)
        .send(payload)
        .expect(404);

      expect(spy).toBeCalledWith(_id.toString());
      expect(spy).toBeCalledTimes(1);
    });

    test("should return error because of invalid id", async () => {
      const token = generateToken();
      const payload = generateUserPayload();
      const _id = mongoose.Types.ObjectId();

      const { body } = await request(app)
        .put("/api/v1/users/" + _id + "123")
        .set("auth", token)
        .send(payload)
        .expect(400);
    });

    test("should return error because of invalid token", async () => {
      const token = generateToken();
      const payload = generateUserPayload();
      const _id = mongoose.Types.ObjectId();

      const { body } = await request(app)
        .put("/api/v1/users/" + _id)
        .set("auth", token + "123")
        .send(payload)
        .expect(400);
    });

    test("should return error because of no token provided", async () => {
      const payload = generateUserPayload();
      const _id = mongoose.Types.ObjectId();

      const { body } = await request(app)
        .put("/api/v1/users/" + _id)
        .send(payload)
        .expect(403);
    });

    test("should return error because email is invalid", async () => {
      const token = generateToken();
      const payload = generateUserPayload();
      payload.email = "inv";
      const _id = mongoose.Types.ObjectId();

      const { body } = await request(app)
        .put("/api/v1/users/" + _id)
        .set("auth", token)
        .send(payload)
        .expect(400);
    });

    test("should return error because username is invalid", async () => {
      const token = generateToken();
      const payload = generateUserPayload();
      payload.username = "inv";
      const _id = mongoose.Types.ObjectId();

      const { body } = await request(app)
        .put("/api/v1/users/" + _id)
        .set("auth", token)
        .send(payload)
        .expect(400);
    });

    test("should return error because password is invalid", async () => {
      const token = generateToken();
      const payload = generateUserPayload();
      payload.password = "inv";
      const _id = mongoose.Types.ObjectId();

      const { body } = await request(app)
        .put("/api/v1/users/" + _id)
        .set("auth", token)
        .send(payload)
        .expect(400);
    });
  });
});

describe("AuthService", () => {
  describe("logIn", () => {
    test("should return token", async () => {
      const token = generateToken();
      const payload = generateUserPayload();
      const userData = generateUserData(payload);
      const spy = jest.spyOn(authService, "logIn").mockResolvedValueOnce(token);

      const { body } = await request(app)
        .post("/api/v1/auth")
        .send({
          email: payload.email,
          password: payload.password,
        })
        .expect(200);

      expect(spy).toBeCalledWith(payload.email, payload.password);
      expect(spy).toBeCalledTimes(1);
      spy.mockRestore();
    });

    test("should error because of bad credentials", async () => {
      const payload = generateUserPayload();
      const userData = generateUserData(payload);
      const spy = jest
        .spyOn(userRepository, "getUserByEmail")
        .mockResolvedValueOnce(userData);

      const { body } = await request(app)
        .post("/api/v1/auth")
        .send({
          email: payload.email,
          password: payload.password,
        })
        .expect(401);

      expect(spy).toBeCalledWith(payload.email);
      expect(spy).toBeCalledTimes(1);
    });
  });
});
