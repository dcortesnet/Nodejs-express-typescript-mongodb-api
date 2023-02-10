import { app } from "./app";
import Logger from "./config/logger";
import config from "./config/environments";

app
  .listen(config.port, () => {
    Logger.info(`
    ################################################
          Server listening on port: ${config.port}
    ################################################
  `);
  })
  .on("error", (err) => {
    Logger.error(err);
    process.exit(1);
  });
