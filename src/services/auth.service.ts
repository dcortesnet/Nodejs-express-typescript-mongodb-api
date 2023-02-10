import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/environments';
import Logger from '../config/logger';
import * as userRepository from '../repositories/user.repository';
import { DataStoredInToken } from '../interfaces/token.interface';
import { HttpException } from '../exceptions/http.exception';

export const logIn = async (email: string, password: string): Promise<any>  => {
    Logger.debug(`Autenticando a usuario ${email}`);
    const loggingUser = await userRepository.getUserByEmail(email);
    let isPasswordCorrect = false;
    if (loggingUser) {
      Logger.debug(`Se procede a verificar contraseña del usuario ${loggingUser.username}`);
      isPasswordCorrect = await bcrypt.compare(
        password,
        loggingUser.password
      );
      if (isPasswordCorrect) {
        const expiresInMinutes = "120m";
        const dataStoredInToken: DataStoredInToken = {
          _id: loggingUser._id as string,
        };
        Logger.debug(`Se crea token JWT de sesion para el usuario ${loggingUser.username}`);
        const token = jwt.sign(dataStoredInToken, config.jwtsecret, {
          expiresIn: expiresInMinutes,
        });
        return {token} ;
      }
    }
    Logger.error(`Error al autenticar a usuario ${email} - ${isPasswordCorrect}`);
    throw new HttpException(401, 'Not authorized', 'Invalid credentials');
  }
