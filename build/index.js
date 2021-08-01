#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const shell = require("shelljs");
const inquirer = require("inquirer");
const gitRelated_js_1 = require("./gitRelated.js");
const constants_1 = require("./constants");
shell.config.silent = true;
const GIT_DIR = { dirname: "github-fresco" };
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // * check for git. throw error if not.
    const doesGitExists = gitRelated_js_1.checkIfGitExists();
    if (!doesGitExists) {
        console.log("ERROR: Please check if git can be run by 'git' command from terminal");
        shell.exit(0);
    }
    gitRelated_js_1.makeGitRepo(GIT_DIR);
    gitRelated_js_1.moveToGitDir(GIT_DIR);
    let isRemoteSet = true;
    isRemoteSet = yield gitRelated_js_1.checkGitRemote();
    if (!isRemoteSet) {
        console.log("remote is set!");
    }
    else {
        console.log("remote is not set. Let's set it");
        yield inquirer
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
                validate(remote) {
                    return ((remote.startsWith("https://github.com/") &&
                        remote.endsWith(".git")) ||
                        "Should be in https://github.com/????/????.git format");
                },
            },
        ])
            .then((answers) => {
            // ? if user provided remote repo url
            if (answers.shouldSetRemote) {
                isRemoteSet = gitRelated_js_1.connectGitToRemote({
                    remoteURL: answers.gitRemote,
                });
                if (isRemoteSet) {
                    console.log("Remote has been set!");
                }
                else {
                    console.log("Failed to add the url as remote. You should do this by yourself");
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
            validate(answer) {
                return !isNaN(Date.parse(answer)) || "Should be in YYYY-MM-DD format";
            },
        },
        {
            type: "input",
            name: "totalDays",
            message: "How many days should be filled?",
            default: 1,
            validate(days) {
                const parsedDays = Number(days);
                const isDaysValid = Number.isInteger(parsedDays) && parsedDays >= 0;
                return isDaysValid || "Should be an integer that is 0 or positive";
            },
        },
    ])
        .then((answers) => {
        try {
            gitRelated_js_1.fillDays({
                startingDate: new Date(answers.startingDate),
                totalDays: parseInt(answers.totalDays),
                commitsPerDay: constants_1.COMMIT_PER_DAY,
            });
            if (isRemoteSet) {
                gitRelated_js_1.gitPush({ force: true });
                console.log("Successfully made commits and pushed to origin!");
            }
        }
        catch (e) {
            console.log("Failed to commit and push");
            console.log(e);
        }
        finally {
            console.log("done!");
        }
    });
});
main();
//# sourceMappingURL=index.js.map