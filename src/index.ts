#!/usr/bin/env node

// TODO: try bin
// TODO: add loading bar

import * as shell from "shelljs";
import * as inquirer from "inquirer";

import {
  checkGitRemote,
  checkIfGitExists,
  connectGitToRemote,
  gitPush,
  makeGitRepo,
  moveToGitDir,
  fillDays,
  // drawShape,
} from "./gitRelated.js";
import { COMMIT_PER_DAY } from "./constants";

shell.config.silent = true;

const GIT_DIR = { dirname: "github-fresco" };

const main = async () => {
  // * check for git. throw error if not.
  const doesGitExists = checkIfGitExists();
  if (!doesGitExists) {
    console.log(
      "ERROR: Please check if git can be run by 'git' command from terminal"
    );
    shell.exit(0);
  }

  makeGitRepo(GIT_DIR);
  moveToGitDir(GIT_DIR);
  let isRemoteSet = true;

  isRemoteSet = await checkGitRemote();

  if (isRemoteSet) {
    console.log("remote is set!");
  } else {
    console.log("remote is not set. Let's set it");
    await inquirer
      .prompt([
        {
          type: "confirm",
          name: "shouldSetRemote",
          message: "Remote is not set. Would you like to set it now?",
          default: true,
        },
        {
          type: "input",
          name: "gitRemote",
          message: "Make a new repo in github, and paste the url of .git file",
          when(answers) {
            return answers.shouldSetRemote;
          },
          validate(remote: string) {
            return (
              (remote.startsWith("https://github.com/") &&
                remote.endsWith(".git")) ||
              "Should be in https://github.com/????/????.git format"
            );
          },
        },
      ])
      .then((answers) => {
        // ? if user provided remote repo url
        if (answers.shouldSetRemote) {
          const { result, msg } = connectGitToRemote({
            remoteURL: answers.gitRemote,
          });
          isRemoteSet = result;
          if (isRemoteSet) {
            console.log("Remote has been set!");
          } else {
            if (msg === "remote exists") {
              console.log("Remote already exists");
            } else {
              console.log(
                "Failed to add the url as remote. You should do this by yourself"
              );
            }
          }
        }
      });
  }

  inquirer
    .prompt([
      {
        type: "input",
        name: "startingDate",
        message: "When is the starting date?",
        validate(answer: string) {
          return !isNaN(Date.parse(answer)) || "Should be in YYYY-MM-DD format";
        },
      },
      {
        type: "input",
        name: "totalDays",
        message: "How many days should be filled?",
        default: 1,
        validate(days: string) {
          const parsedDays = Number(days);
          const isDaysValid = Number.isInteger(parsedDays) && parsedDays >= 0;
          return isDaysValid || "Should be an integer that is 0 or positive";
        },
      },
    ])
    .then((answers) => {
      try {
        fillDays({
          startingDate: new Date(answers.startingDate),
          totalDays: parseInt(answers.totalDays),
          commitsPerDay: COMMIT_PER_DAY,
        });
        if (isRemoteSet) {
          gitPush({ force: true });
          console.log("Successfully made commits and pushed to origin!");
        }
      } catch (e) {
        console.log("Failed to commit and push");
        console.log(e);
      } finally {
        console.log("done!");
      }
    });
};

main();
