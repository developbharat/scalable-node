require("reflect-metadata");
import connectRedis from "connect-redis";
import express, { RequestHandler } from "express";
import { graphqlHTTP } from "express-graphql";
import session from "express-session";
import http from "http";
import path from "path";
import { buildSchema } from "type-graphql";
import { config } from "./config";
import { __PROD__ } from "./constants";
import { RedisDatabase } from "./db/RedisDatabase";
import { SQLDatabase } from "./db/SQLDatabase";
import { init_event_receivers } from "./events";
import { ApiRouter } from "./express";
import { logger } from "./utils/logger";
import { EnvironmentValidators } from "./validators/EnvironmentValidators";

export class MainServer {
  private static _httpServer: http.Server;

  public static async init(): Promise<void> {
    // Validate enviroment configuration
    const isEnvValid = EnvironmentValidators.isEnvConfigValid(config);
    if (!isEnvValid) {
      logger.error(EnvironmentValidators.error);
      process.exit(1);
    }

    // Initialize database
    await SQLDatabase.init();

    // Initialize all event receivers.
    // You need to call them atleast once to register for events
    await init_event_receivers();

    // Express Server
    await this.create_express_server();
  }

  public static start(): void {
    if (!this._httpServer) throw new Error("MainServer not initialized...");

    this._httpServer.listen(config.root.port, () => {
      logger.debug(`Server started at http://localhost:${config.root.port}`);
    });
  }

  public static get server(): http.Server {
    if (!this._httpServer) throw new Error("MainServer not initialized...");
    return MainServer._httpServer;
  }

  private static async create_express_server(): Promise<http.Server> {
    const app = express();
    app.use(express.json());

    const RedisStore = connectRedis(session);
    app.use(
      session({
        name: "qid",
        store: new RedisStore({ client: RedisDatabase.client }),
        secret: config.session.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: __PROD__,
          secure: __PROD__,
          signed: true,
          sameSite: "lax"
        }
      })
    );

    // API Routes
    app.use("/api", ApiRouter());

    // Grapqhl Routes
    const apolloMiddleware = await this.create_apollo_middleware();
    app.use("/graphql", apolloMiddleware);

    // Error handlers.
    app.use((err: any, _req: any, res: any, next: any) => {
      if (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        return res.status(500).json({ error: err.message });
      } else {
        return next();
      }
    });

    // Configure 404 Routes
    app.use("*", (_req, res, _next) => {
      return res.status(404).json({ error: "Requested route not found." });
    });

    // Create http server.
    this._httpServer = http.createServer(app);
    return this._httpServer;
  }

  private static async create_apollo_middleware(): Promise<RequestHandler> {
    const schema = await buildSchema({
      resolvers: [path.join(__dirname, "apollo", "resolvers", "**", "*Resolver.*")],
      validate: false // Don't use class-validator dependency
    });

    const apollo = graphqlHTTP((req, res, _) => ({
      schema: schema,
      graphiql: !__PROD__,
      context: {
        req,
        res
      }
    }));

    return apollo;
  }
}

export const main = async (): Promise<void> => {
  await MainServer.init();
  MainServer.start();
};

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
