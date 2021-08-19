import { MainServer } from "./MainServer";
import { logger } from "./utils/logger";

export const main = async (): Promise<void> => {
  await MainServer.init();
  MainServer.start();
};

main().catch(async (err) => {
  logger.error(err);
  await MainServer.shutdown();
  process.exit(1);
});
