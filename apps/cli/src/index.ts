#!/usr/bin/env node

// TODO: try bin
// TODO: add loading bar

import inquirer from "inquirer";

import { Shell, gitCommands, COMMIT_PER_DAY, moveToDir, GP } from "fresco-core";

const GIT_DIR = { dirname: "github-fresco" };

const main = async () => {
  // * check for git. throw error if not.
  const doesGitExists = gitCommands.isGitInstalled();
  if (!doesGitExists) {
    console.log(
      "ERROR: Please check if git can be run by 'git' command from terminal"
    );
    Shell.exit(0);
  }

  gitCommands.init(GIT_DIR);
  moveToDir(GIT_DIR);

  const { isRemoteSet, remoteUrl } = await gitCommands.checkOrigin();

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
          const { isSuccessful: setRemoteResult, msg } = gitCommands.addOrigin({
            remoteURL: answers.gitRemote,
          });
          if (setRemoteResult) {
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

  const currentBranchCommitCount = gitCommands.commitCountCurrentBranch();

  inquirer
    .prompt([
      {
        type: "input",
        name: "startingDate",
        message: "When is the starting date? (YYYY-MM-DD)",
        validate(answer: string) {
          const isParsableToDate = !isNaN(Date.parse(answer));
          return isParsableToDate || "Should be in YYYY-MM-DD format";
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
      {
        type: "confirm",
        name: "shouldRemoveAllExistingCommits",
        message: `Current branch has ${currentBranchCommitCount} commits. Would you like to erase all existing commits?`,
        default: true,
      },
    ])
    .then((answers) => {
      try {
        if (answers.shouldRemoveAllExistingCommits) {
          gitCommands.removeAllCommitsInCurrentBranch();
        }

        gitCommands.fillDateRangeWithCommits({
          startingDate: new Date(answers.startingDate),
          totalDays: parseInt(answers.totalDays),
          // ? Chagne line below to make a painting.
          // ? (start from the first Sunday of a year. (2016-01-03))
          dailyCommits: COMMIT_PER_DAY,
          // dailyCommits: GP,
        });
        if (isRemoteSet) {
          const pushResult = gitCommands.pushToOrigin({ force: true });
          if (pushResult.code !== 0) {
            console.error("Failed to push to origin");
            console.error(pushResult.stderr);
          }

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
