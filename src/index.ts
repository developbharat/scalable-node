require("reflect-metadata");
import connectRedis from "connect-redis";
import express from "express";
import session from "express-session";
import http from "http";
import { create_apollo_server } from "./apollo";
import { config } from "./config";
import { __PROD__ } from "./constants";
import { RedisDatabase } from "./db/RedisDatabase";
import { SQLDatabase } from "./db/SQLDatabase";
import { init_event_receivers } from "./events";
import { ApiRouter } from "./express";
import { logger } from "./utils/logger";
import { EnvironmentValidators } from "./validators/EnvironmentValidators";

const setup_worker = async (): Promise<http.Server> => {
  // Validate enviroment configuration
  const isEnvValid = EnvironmentValidators.isEnvConfigValid(config);
  if (!isEnvValid) {
    logger.error(EnvironmentValidators.error);
    process.exit(1);
  }

  // Initialize database
  await SQLDatabase.init();

  await init_event_receivers();

  // Initialize express application
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

  const apollo = await create_apollo_server();
  app.use("/graphql", apollo);
  app.use("/api", ApiRouter());

  // Configure error handlers.
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
  const httpServer = http.createServer(app);

  // Start http server
  httpServer.listen(config.root.port, () => {
    logger.debug(`Server started at http://localhost:${config.root.port}`);
  });

  return httpServer;
};

// const setup_cluster = () => {
//   if (cluster.isMaster) {
//     const numCPUs = os.cpus().length;

//     for (let i = 0; i < numCPUs; i++) {
//       logger.debug(`Forking process number ${i}...`);
//       cluster.fork();
//     }

//     cluster.on("exit", (worker) => {
//       logger.debug(`Worker ${worker.process.pid} died`);
//       cluster.fork();
//     });
//   }
// };

const main = async (): Promise<void> => {
  // if (__PROD__) {
  //   if (cluster.isMaster) {
  //     setup_cluster();
  //   } else {
  //     await setup_worker();
  //   }
  // } else {
  await setup_worker();
  // }
};

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
