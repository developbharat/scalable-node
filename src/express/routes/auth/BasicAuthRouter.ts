import { Router } from "express";
import * as authService from "../../../services/auth/auth.service";
import { AuthValidators } from "../../../validators/AuthValidators";
import { isAuthenticated } from "../../middlewares/isAuth";

export const BasicAuthRouter = (): Router => {
  const router = Router();

  router.get("/me", isAuthenticated, (req, res) => {
    return res.status(200).json(req.session.user);
  });

  router.post(
    "/signin",
    (req, _res, next) => {
      return !AuthValidators.isEmailValid(req.body.email) ? next(new Error(AuthValidators.error)) : next();
    },
    async (req, res, next) => {
      try {
        const { email, password } = req.body;
        const user = await authService.signin({
          email: email as string,
          password: password as string
        });
        return res.status(200).json(user);
      } catch (err) {
        return next(err);
      }
    }
  );

  router.post("/signup", async (req, res, next) => {
    try {
      const { firstname, lastname, email, password } = req.body;
      const user = await authService.signup({ firstname, lastname, email, password });
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  });

  router.post("/activate-account", async (req, res, next) => {
    try {
      const { email, code } = req.body;
      const user = await authService.activate_user_account({ email, code });
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  });

  router.post("/password-reset", async (req, res, next) => {
    try {
      const { email, code, newPassword } = req.body;
      const user = await authService.reset_user_password({ email, code, newPassword });
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  });

  router.use((err: any, _req: any, res: any, _next: any) => {
    return res.status(400).json({ error: err.message });
  });

  return router;
};
