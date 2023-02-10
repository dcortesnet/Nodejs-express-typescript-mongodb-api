import Joi from "joi";
import Logger from "../config/logger";
import { HttpException } from "../exceptions/http.exception";

function getBody(req: any){
  const body = req.body

  if(!body) {
    return body;
  }

  return body;

}

 export function joiValidation(req: any, res: any, next: any) {
  const user = getBody(req)
  const schema = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
  });

  if(user){
    const isValid = schema.validate(user);
    if(isValid.error){
      Logger.error(isValid.error.details[0].message);
      throw new HttpException(400, 'Bad request', isValid.error.details[0].message)
    }else{
      next();
    }
  }else{
    Logger.error("No body was provided");
    return res.status(403).json({
      message: "no body was provided"
    })

  }
}

export function joiValidationPatch(req: any, res: any, next: any) {
  const user = getBody(req)
  const schema = Joi.object({
    username: Joi.string().min(5).max(30),
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(5).max(255),
  });

  if(user){
    const isValid = schema.validate(user);
    if(isValid.error){
      return res.status(400).json({
        message: isValid.error.details[0].message
      })
    }else{
      next();
    }
  }else{
    return res.status(403).json({
      message: "no body was provided"
    })

  }
}



