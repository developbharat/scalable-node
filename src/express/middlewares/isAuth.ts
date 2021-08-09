import { RequestHandler } from "express";
import { AuthError, AuthStatusCodes } from "../../core/errors/CustomError";

export const isAuthenticated: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.session.user) throw new AuthError(AuthStatusCodes.UnAuthenticated, "User is not logged in.");
    return next();
  } catch (err) {
    return next(new AuthError(AuthStatusCodes.UnAuthenticated, err.message));
  }
};
