const resolve = require("path").resolve;
const fs = require("fs").promises;
const process = require("process");
const waitOn = require("wait-on");
const socketPath = { host: "localhost", port: 3551 };
const outputFolder = resolve(__dirname, "./textfile_collector");
const outputFilename = process.env.APCUPSD_OUTPUT_FILEPATH ? process.env.APCUPSD_OUTPUT_FILEPATH : 'apcupsd.prom';
const outputPath = resolve(outputFolder, outputFilename);
const debug = process.env.APCUPSD_DEBUG ? true : false;
const schedule = process.env.APCUPSD_POLL_CRON ? process.env.APCUPSD_POLL_CRON : "* * * * *";
const timeout = process.env.APCUPSD_TIMEOUT ? process.env.APCUPSD_TIMEOUT : 30000;
const parseData = require("./parseData");
const cron = require("node-cron");
const { exec } = require('child_process');

const log = (...msg) => {
  if (debug) {
    console.log(...msg);
  }
};

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
    resources: [`tcp:${socketPath.port}`],
    timeout, // fail if waiting longer than 30 seconds
  })
    .then(() => log("Creating output folder..."))
    .then(() => fs.mkdir(outputFolder, { recursive: true }))
    .then(async () => {
      log("Connecting...");
      return cron.schedule(schedule, async () => {
        log("Getting status...");
        try {
          // TODO: safer way to do this?
          exec(`apcaccess status ${socketPath.host}:${socketPath.port}`, async (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            
            var re = /(\w+\s?\w+)\s*:\s(.+)?\n/g;
            var matches = {};
            var match = re.exec(stdout);
            while (match != null) {
              matches[match[1]] = match[2];
              match = re.exec(stdout);
            }
            log(matches);
            await fs.writeFile(outputPath, parseData(matches));
    
          });
        } catch (e) {
          log(e);
        }
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
