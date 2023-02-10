import faker from "faker";
import { DataStoredInToken } from "../../src/interfaces/token.interface";
import config from "../../src/config/environments";
import jwt from "jsonwebtoken";
import { IUser } from "../../src/models/user.model";

export function generateUserData(overide = {}) {
  const userData = {
    _id: faker.random.word(),
    username: faker.internet.userName() + "12345",
    email: "12345" + faker.internet.email(),
    password: faker.internet.password() + "12345",
    ...overide,
  } as IUser;
  return userData;
}

export function generateUsersData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, id) => {
      return generateUserData({ _id: id, ...overide });
    }
  );
}

export function generateUserPayload() {
  return {
    username: faker.internet.userName() + "12345",
    email: "12345" + faker.internet.email(),
    password: faker.internet.password() + "12345",
  } as IUser;
}

export function generateToken() {
  const dataStoredInToken: DataStoredInToken = {
    _id: faker.random.word(),
  };
  const token = jwt.sign(dataStoredInToken, config.jwtsecret, {
    expiresIn: "120m",
  });
  return token;
}
