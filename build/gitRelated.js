"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillDays = exports.drawShape = exports.makeCommitsAtDate = exports.connectGitToRemote = exports.checkGitRemote = exports.makeGitRepo = exports.moveToGitDir = exports.gitPush = exports.checkIfGitExists = exports.makeCommitCommand = exports.writeToFile = void 0;
const shell = require("shelljs");
const dateUtil_1 = require("./dateUtil");
const constants_1 = require("./constants");
const writeToFile = ({ file, content, }) => {
    shell.exec(`echo ${content} > ${file}`);
};
exports.writeToFile = writeToFile;
const makeCommitCommand = ({ formattedDate, }) => {
    return (`set GIT_COMMITTER_DATE="${formattedDate} 09:00:00 +0000"` +
        ` && git commit -am "Fnord" --date "${formattedDate} 09:00:00 +0000"`);
};
exports.makeCommitCommand = makeCommitCommand;
const checkIfGitExists = () => !!shell.which("git");
exports.checkIfGitExists = checkIfGitExists;
const gitPush = ({ force = true }) => {
    shell.exec(`git push ${force ? "-f" : ""}`);
};
exports.gitPush = gitPush;
const moveToGitDir = ({ dirname = constants_1.DEFAULT_GIT_DIR, }) => {
    shell.cd(dirname);
};
exports.moveToGitDir = moveToGitDir;
const makeGitRepo = ({ dirname = constants_1.DEFAULT_GIT_DIR, }) => {
    shell.mkdir("-p", `./${dirname}`);
    exports.moveToGitDir({ dirname });
    shell.exec(`git init`);
};
exports.makeGitRepo = makeGitRepo;
const checkGitRemote = () => new Promise((resolve, reject) => {
    try {
        shell.exec(`git config --get remote.origin.url`, (exitCode) => {
            resolve(exitCode === 0);
        });
    }
    catch (e) {
        console.log(e);
        reject();
    }
});
exports.checkGitRemote = checkGitRemote;
const connectGitToRemote = ({ remoteURL, }) => {
    const { 
    // code,
    // stdout,
    stderr, } = shell.exec(`git remote add origin ${remoteURL}`);
    console.log({ stderr });
    if (stderr) {
        return false;
    }
    else {
        return true;
    }
};
exports.connectGitToRemote = connectGitToRemote;
const makeCommitsAtDate = ({ dateObject, commitsPerDay = 0, fileTobeEdited, }) => {
    for (let i = 1; i <= commitsPerDay; i++) {
        exports.writeToFile({
            file: fileTobeEdited,
            content: `github-fresco: ${dateObject.getTime()}_${i}_${Math.random()}`,
        });
    }
    shell.exec(exports.makeCommitCommand({ formattedDate: dateUtil_1.formatDate(dateObject) }));
};
exports.makeCommitsAtDate = makeCommitsAtDate;
const emptyWeek = [["0"], ["0"], ["0"], ["0"], ["0"], ["0"], ["0"]];
const drawShape = ({ shape2dArray = emptyWeek, startingDate = constants_1.STARTING_DATE, }) => {
    const commitDate = dateUtil_1.copyDate(startingDate);
    for (let m = 0; m < shape2dArray.length; m++) {
        for (let n = 0; n < 7; n++) {
            exports.makeCommitsAtDate({
                dateObject: commitDate,
                commitsPerDay: shape2dArray[n][m] === "1" ? 1 : 0,
                fileTobeEdited: "a.txt",
            });
            dateUtil_1.incrementDate({ dateObject: commitDate, incrementBy: 1 });
        }
    }
};
exports.drawShape = drawShape;
const fillDays = ({ startingDate = constants_1.STARTING_DATE, totalDays = constants_1.TOTAL_DAYS, commitsPerDay = constants_1.COMMIT_PER_DAY, }) => {
    const commitDate = dateUtil_1.copyDate(startingDate);
    for (let i = 0; i < totalDays; i++) {
        exports.makeCommitsAtDate({
            dateObject: commitDate,
            commitsPerDay: commitsPerDay,
            fileTobeEdited: "a.txt",
        });
        dateUtil_1.incrementDate({ dateObject: commitDate, incrementBy: 1 });
    }
};
exports.fillDays = fillDays;
//# sourceMappingURL=gitRelated.js.map