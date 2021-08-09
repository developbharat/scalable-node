import fs from "fs";
import path from "path";

export const init_event_receivers = async (): Promise<void> => {
  const files = fs.readdirSync(path.join(__dirname, "receivers"));
  files.map((file) => require(path.join(__dirname, "receivers", file)));
};
