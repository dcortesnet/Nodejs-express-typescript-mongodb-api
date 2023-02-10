import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { HttpException } from "../exceptions/http.exception";
import { IUser } from "../models/user.model";
import * as userRepository from "../repositories/user.repository";

export const registerUser = async (user: IUser): Promise<IUser> => {
  const existingUserUsername = await userRepository.getUserByUsername(
    user.username
  );
  if (existingUserUsername) {
    throw new HttpException(409, 'Conflict', 'username has already been registered');
  }
  const existingUserEmail = await userRepository.getUserByEmail(user.email);
  if (existingUserEmail) {
    throw new HttpException(409, 'Conflict', 'email has already been registered');
  }
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  const newUser = await userRepository.createUser(user);
  return newUser;
};

export const deleteUser = async (id: string): Promise<any | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpException(400, 'Bad request', 'id is not valid');
  }
  const userToDelete = await userRepository.getUserById(id);
  if(!userToDelete){
    throw new HttpException(404, 'Not found', 'User not found');
  }
  return await userRepository.deleteUser(userToDelete._id);
}

export const updateUser = async(id: string, user: IUser): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpException(400, 'Bad request', 'id is not valid');
  }
  const userToUpdate = await userRepository.getUserById(id);
  if(!userToUpdate){
    throw new HttpException(404, 'Not found', 'User not found');
  }
  if(user.password){
    user.password = await bcrypt.hash(user.password, 10);
  }
  return await userRepository.updateUser(id, user);
}

export const getUserById = async (id: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpException(400, 'Bad request', 'id is not valid');
  }
  return await userRepository.getUserById(id)
}

export const getAllUsers = async (): Promise<IUser[]> => {
  return await userRepository.getAllUsers();
}
