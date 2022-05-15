#!/usr/bin/env node
import { Command } from "commander";
import pkg from "./package.json";
import serve from "./serve";
import deploy from "./deploy";
import dotenv from "dotenv";
import updateNotifier from "update-notifier";
import chalk from "chalk";

dotenv.config();

const notifier = updateNotifier({
  pkg,
  // updateCheckInterval: 1000 * 60 * 60 * 24, // 1 day
});

notifier.notify();

if (notifier.update) {
  const { latest } = notifier.update;
  console.log(
    chalk.yellow(
      `A newer version of Brimble CLI is available: ${latest}
  You are currently on ${pkg.version}
  Run ${chalk.green(`npm install -g @brimble/cli`)} to update.`
    )
  );
}

const program = new Command();

program
  .name("brimble")
  .description(pkg.description)
  .version(pkg.version, "-v, --version", "output the version number");

program
  .command("dev [directory]")
  .description("Preview your awesome project locally")
  .option("-p, --port <port>", "port to serve on", parseInt)
  .option("-o, --open", "open the browser")
  .option("-d, --deploy", "deploy to Brimble")
  .action(serve);

program
  .command("cook [directory]")
  .description("Deploy your project to Brimble cloud")
  .option("-o, --open", "open the browser")
  .option("-d, --domain <domain>", "add your custom domain")
  .action(deploy);

program.parse();
