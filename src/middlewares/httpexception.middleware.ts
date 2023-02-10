import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/http.exception';

const httpExceptionMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Server error';
  const detail = error.detail || ''
  response
    .status(status)
    .send({
      status,
      message,
      detail,
    })
}

export default httpExceptionMiddleware;
