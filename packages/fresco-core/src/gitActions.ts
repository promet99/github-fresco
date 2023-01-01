import shell from "shelljs";

import { changeDateBy, formatDate } from "./dateUtil";
import {
  STARTING_DATE,
  TOTAL_DAYS,
  COMMIT_PER_DAY,
  DEFAULT_GIT_DIR,
} from "./constants";
import { moveToDir, writeToFile } from "./shellActions";

const isGitInstalled = (): boolean => !!shell.which("git");

const init = ({ dirname = DEFAULT_GIT_DIR }: { dirname?: string }): void => {
  shell.mkdir("-p", `./${dirname}`);
  moveToDir({ dirname });
  shell.exec(`git init`);
};

const makeSingleCommitAtDate = ({ date }: { date: Date }) => {
  const formattedDate = formatDate(date);
  const commitMsg = "Fnord";
  // TODO: handle locale
  const commitShellCommand = [
    `set GIT_COMMITTER_DATE="${formattedDate} 09:00:00 +0000"`,
    "git add .",
    `git commit -am ${commitMsg} --date "${formattedDate} 09:00:00 +0000"`,
  ].join(" && ");

  return shell.exec(commitShellCommand);
};

const makeChangeAndmakeCommitsAtDate = ({
  dateObject,
  commitCount: commitCount = 1,
  fileTobeEdited,
}: {
  dateObject: Date;
  commitCount: number;
  fileTobeEdited: string;
}): void => {
  for (let i = 1; i <= commitCount; i++) {
    writeToFile({
      file: fileTobeEdited,
      content: `github-fresco: ${dateObject.getTime()}_${i}_${Math.random()}`,
    });
    const a = makeSingleCommitAtDate({ date: dateObject });
  }
};

const checkOrigin = () =>
  new Promise<{
    isRemoteSet: boolean;
    remoteUrl: string;
  }>((resolve, _reject) => {
    try {
      shell.exec(`git config --get remote.origin.url`, (exitCode, url) => {
        resolve({ isRemoteSet: exitCode === 0, remoteUrl: url });
      });
    } catch (e) {
      resolve({
        isRemoteSet: false,
        remoteUrl: "",
      });
    }
  });

const addOrigin = ({
  remoteURL,
}: {
  remoteURL: string;
}): {
  isSuccessful: boolean;
  msg?: "unknown" | "remote exists";
} => {
  const { stderr } = shell.exec(`git remote add origin ${remoteURL}`);
  if (stderr) {
    return {
      isSuccessful: false,
      msg:
        stderr === "error: remote origin already exists.\n"
          ? "remote exists"
          : "unknown",
    };
  } else {
    return {
      isSuccessful: true,
    };
  }
};

const pushToOrigin = ({ force = true }: { force: boolean }) =>
  shell.exec(`git push ${force ? "-f" : ""} --set-upstream origin master`);

type weekType = number[];
type shapedArray = [
  weekType,
  weekType,
  weekType,
  weekType,
  weekType,
  weekType,
  weekType
];
const emptyWeek = [[0], [0], [0], [0], [0], [0], [0]] as shapedArray;

const drawShape = ({
  shape2dArray = emptyWeek,
  startingDate = STARTING_DATE,
}: {
  shape2dArray: shapedArray;
  startingDate: Date;
}): void =>
  shape2dArray.forEach((week, weekIndex) => {
    week.forEach((dayCommitCount, dayIndex) => {
      const delta = weekIndex * 7 + dayIndex;
      const commitDate = changeDateBy({ dateObject: startingDate, delta });
      const commitsPerDay = dayCommitCount;
      if (commitsPerDay > 0) {
        makeChangeAndmakeCommitsAtDate({
          dateObject: commitDate,
          commitCount: commitsPerDay,
          fileTobeEdited: "a.txt",
        });
      }
    });
  });

const fillDateRangeWithCommits = ({
  startingDate = STARTING_DATE,
  totalDays = TOTAL_DAYS,
  dailyCommits: dailyCommits = COMMIT_PER_DAY,
}: {
  startingDate: Date;
  totalDays: number;
  dailyCommits: number | number[];
}) => {
  for (let i = 0; i < totalDays; i++) {
    const date = changeDateBy({ dateObject: startingDate, delta: i });
    const commitCount =
      typeof dailyCommits === "number" ? dailyCommits : dailyCommits[i] || 0;
    makeChangeAndmakeCommitsAtDate({
      dateObject: date,
      commitCount,
      fileTobeEdited: "a.txt",
    });
  }
};

export const gitCommands = {
  isGitInstalled,
  init,
  makeSingleCommitAtDate,
  fillDateRangeWithCommits,
  drawShape,
  pushToOrigin,
  checkOrigin,
  addOrigin,
};
