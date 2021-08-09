import { RequestHandler } from "express";
import { AuthError, AuthStatusCodes } from "../../core/errors/CustomError";
import { UserRole } from "../../entities/auth/UserRole";

export const isRoleRestricted = (...roles: string[]): RequestHandler => {
  return (req, _res, next) => {
    try {
      if (!req.session.user)
        throw new AuthError(AuthStatusCodes.UnAuthenticated, "You are not logged in. Please login to continue.");

      if (roles.includes(req.session.user.role))
        throw new AuthError(AuthStatusCodes.UnAuthorized, "You don't have permissions to access this resource.");

      return next();
    } catch (err) {
      return next(new AuthError(AuthStatusCodes.UnAuthorized, err.message));
    }
  };
};

export const isAdminRestricted: RequestHandler = isRoleRestricted(UserRole.admin);
export const isClientRestricted: RequestHandler = isRoleRestricted(UserRole.client);
