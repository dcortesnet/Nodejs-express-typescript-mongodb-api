import { NextFunction, Router } from "express";
import { joiValidation } from "../validators/entries.validator";
import Logger from "../config/logger";
import * as userService from "../services/user.service";
import { validateToken } from "../validators/jwt.validator";
import { Request, Response } from 'express';

const router = Router();

router.post("", joiValidation,   async (req: Request, res: Response, next: NextFunction) => {
  try {
    Logger.debug(
      `Calling User Register endpoint with body ` +
        "{ username: " +
        req.body.username +
        ", email: " +
        req.body.email +
        ", password: PRIVATE VALUE"
    );
    const user = await userService.registerUser(req.body);
    return await res.status(201).json({
      message: "User Created",
      userData: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    Logger.error(err.message)
    next(err);
  }
});

router.get("", validateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    Logger.debug("Calling Get All Users endpoint");
    const users = await userService.getAllUsers();
    return await res.status(200).json({
      message: "Users fetched successfully",
      usersData: users,
    });
  } catch (err) {
    Logger.error(err.message)
    next(err);
  }
});

router.get("/:id", validateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    Logger.debug("Calling Get User by ID endpoint");
    const user = await userService.getUserById(req.params.id);
    return await res.status(200).json({
      message: "User fetched successfully",
      userData: user,
    });
  } catch (err) {
    Logger.error(err.message)
    next(err);
  }
});

router.delete("/:id", validateToken , async (req: Request, res: Response, next: NextFunction) => {
  try {
    Logger.debug("Calling Delete User by ID endpoint");
    await userService.deleteUser(req.params.id);
    return await res.status(200).json({
      message: "User deleted successfully!",
    });
  } catch (err) {
    Logger.error(err.message)
    next(err);
  }
});

router.put("/:id", validateToken, joiValidation,  async (req: Request, res: Response, next: NextFunction) => {
  try {
    Logger.debug("Calling Update User by ID endpoint");
    await userService.updateUser(req.params.id, req.body);
    return await res.status(200).json({
      message: "User updated succsessfully!",
    });
  } catch (err) {
    Logger.error(err.message)
    next(err);
  }
});

export default router;
