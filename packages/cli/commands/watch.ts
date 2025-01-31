import { log } from "@brimble/utils";
import chalk from "chalk";
import chokidar from "chokidar";
import Conf from "configstore";
const watch = (directory: string, options: { projectID: string }) => {
  const config = new Conf("brimble");
  const projectID = options.projectID;
  const project: { changedFiles: string[]; projectID: number; name: string } =
    config.get(projectID);

  if (!project) {
    log.error(chalk.red(`Project ${projectID} not found`));
    process.exit(1);
  }

  const watcher = chokidar.watch(directory, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("all", async (event: string, file: string) => {
    if (
      !file.includes("node_modules/") &&
      !file.includes("build") &&
      !file.includes("dist/") &&
      !file.includes(".git/") &&
      !file.includes(".angular/cache/") &&
      !file.includes(".next/") &&
      !file.includes(".cache/")
    ) {
      const changedFiles = project.changedFiles || [];
      changedFiles.push(file);
      config.set(`${project.projectID}`, {
        ...project,
        changedFiles: [...new Set(changedFiles)],
      });
      config.set(`${project.name}`, {
        ...project,
        changedFiles: [...new Set(changedFiles)],
      });
    }
  });
};

export default watch;
