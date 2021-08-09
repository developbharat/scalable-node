import { Response, Request } from "express";
import session from "express-session";
import { User } from "./models/User";

declare module "express-session" {
  interface SessionData {
    user?: User;
  }
}

declare global {
  interface ExpressContext {
    req: Request;
    res: Response;
  }
}
