import { Router } from "express";
import { BasicAuthRouter } from "./routes/auth/BasicAuthRouter";

export const ApiRouter = (): Router => {
  const router = Router();

  router.use("/auth/basic", BasicAuthRouter());

  return router;
};
