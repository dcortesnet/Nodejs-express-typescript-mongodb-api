import User, { IUser } from "../models/user.model";

export const getAllUsers = async (): Promise<Array<IUser>> => {
  return await User.find();
};

export const getUserById = async (id: string): Promise<IUser | any> => {
  return await User.findById({ _id: id });
};

export const getUserByEmail = async (
  email: string
): Promise<IUser | any> => {
  return await User.findOne({ email: email });
};

export const getUserByUsername = async (
  username: string
): Promise<IUser | any> => {
  return await User.findOne({ username: username });
};

export const createUser = async (user: IUser): Promise<IUser> => {
  const newUser = new User({
    username: user.username,
    email: user.email,
    password: user.password,
  });
  await newUser.save();
  return newUser;
};

export const deleteUser = async (id: string) => {
  return await User.deleteOne({ _id: id });
};

export const updateUser = async (id: string, user: IUser) => {
  return await User.updateOne({ _id: id }, user);
};
