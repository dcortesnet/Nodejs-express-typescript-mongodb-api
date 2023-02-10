import jwt from "jsonwebtoken";
import config from "../config/environments";
import Logger from "../config/logger";

function getTokenFHeaders(req: any) {
  const token = req.body.token || req.query.token || req.headers["auth"];

  if (!token) {
    return token;
  }

  return token;
}

export function validateToken(req: any, res: any, next: any) {
  const token = getTokenFHeaders(req);

  if (token) {
    jwt.verify(token, config.jwtsecret, (err: any, decoded: any) => {
      if (err) {
        Logger.error("Failed to authenticate the provided token");
        return res.status(400).json({
          message: "Failed to authenticate the provided token",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    Logger.error("No token was provided");
    return res.status(403).json({
      message: "No token was provided",
    });
  }
}
