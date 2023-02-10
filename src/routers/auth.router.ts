import { NextFunction, Router } from "express";
import * as authService from "../services/auth.service";
import { Request, Response } from 'express';



const router = Router();

router.post("", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.logIn(req.body.email, req.body.password);
    return res.status(200).json({
      message: "user logged in successfully!",
      token: user.token
    });
  } catch (err) {
    next(err);
  }
});

export default router;
