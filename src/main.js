const resolve = require("path").resolve;
const fs = require("fs").promises;
const process = require("process");
const waitOn = require("wait-on");
const host = process.env.APCUPSD_HOST ? process.env.APCUPSD_HOST : "localhost";
const port = process.env.APCUPSD_PORT ? process.env.APCUPSD_PORT : 3551;
const socketPath = { host, port };
const outputFolder = resolve(__dirname, "./textfile_collector");
const outputFilename = process.env.APCUPSD_OUTPUT_FILEPATH ? process.env.APCUPSD_OUTPUT_FILEPATH : 'apcupsd.prom';
const outputPath = resolve(outputFolder, outputFilename);
const debug = process.env.APCUPSD_DEBUG ? true : false;
const schedule = process.env.APCUPSD_POLL_CRON ? process.env.APCUPSD_POLL_CRON : "* * * * *";
const timeout = process.env.APCUPSD_TIMEOUT ? process.env.APCUPSD_TIMEOUT : 30000;
const parseData = require("./parseData");
const cron = require("node-cron");
const ApcAccess = require("apcaccess");
const { exec } = require('child_process');

const log = (...msg) => {
  if (debug) {
    console.log(...msg);
  }
};

const client = new ApcAccess();

const main = async () => {

  if (!cron.validate(schedule)) {
    log(`Invalid cron schedule: ${schedule}`);
    process.exit(1);
  }

  log(`Starting
    Output Path: ${outputPath}
    Socket Path: ${JSON.stringify(socketPath)}
    Cron Schedule: ${schedule}

Waiting for socket...
  `);
  await waitOn({
    resources: [`tcp:${socketPath.host}:${socketPath.port}`],
    timeout, // fail if waiting longer than 30 seconds
  })
    .then(() => log("Creating output folder..."))
    .then(() => fs.mkdir(outputFolder, { recursive: true }))
    .then(() => apcaccess.connect(socketPath.host, socketPath.port))
    .then(async () => {
      log("Connecting...");
      return cron.schedule(schedule, async () => {
        log("Getting status...");
        const status = await client.statusJson();
        console.log(status);
        await fs.writeFile(outputPath, parseData(status));
      });
    })
    .then(
      () => log("Cron job started"),
    )
    .catch((e) => {
      log(e);
      process.exit(1);
    });
};

main().catch(log);
