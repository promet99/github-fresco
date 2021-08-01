import * as shell from "shelljs";

import { copyDate, formatDate, incrementDate } from "./dateUtil";
import {
  STARTING_DATE,
  TOTAL_DAYS,
  COMMIT_PER_DAY,
  DEFAULT_GIT_DIR,
} from "./constants";
import { HEART } from "./shapes";

export const writeToFile = ({
  file,
  content,
}: {
  file: string;
  content: string | number;
}): void => {
  shell.exec(`echo ${content} > ${file}`);
};

export const makeCommitCommand = ({
  formattedDate,
}: {
  formattedDate: string;
}): string => {
  return (
    `set GIT_COMMITTER_DATE="${formattedDate} 09:00:00 +0000"` +
    ` && git commit -am "Fnord" --date "${formattedDate} 09:00:00 +0000"`
  );
};

export const checkIfGitExists = (): boolean => !!shell.which("git");

export const gitPush = ({ force = true }: { force: boolean }) => {
  shell.exec(`git push ${force ? "-f" : ""}`);
};

export const moveToGitDir = ({
  dirname = DEFAULT_GIT_DIR,
}: {
  dirname?: string;
}): void => {
  shell.cd(dirname);
};

export const makeGitRepo = ({
  dirname = DEFAULT_GIT_DIR,
}: {
  dirname?: string;
}): void => {
  shell.mkdir("-p", `./${dirname}`);
  moveToGitDir({ dirname });
  shell.exec(`git init`);
};

export const checkGitRemote = () =>
  new Promise<boolean>((resolve, reject) => {
    try {
      shell.exec(`git config --get remote.origin.url`, (exitCode) => {
        resolve(exitCode === 0);
      });
    } catch (e) {
      console.log(e);
      reject();
    }
  });

export const connectGitToRemote = ({
  remoteURL,
}: {
  remoteURL: string;
}): {
  result: boolean;
  msg?: "unknown" | "remote exists";
} => {
  const {
    // code,
    // stdout,
    stderr,
  } = shell.exec(`git remote add origin ${remoteURL}`);
  if (stderr) {
    return {
      result: false,
      msg:
        stderr === "error: remote origin already exists.\n"
          ? "remote exists"
          : "unknown",
    };
  } else {
    return {
      result: true,
    };
  }
};

export const makeCommitsAtDate = ({
  dateObject,
  commitsPerDay = 0,
  fileTobeEdited,
}: {
  dateObject: Date;
  commitsPerDay?: number;
  fileTobeEdited?: string;
}): void => {
  for (let i = 1; i <= commitsPerDay; i++) {
    writeToFile({
      file: fileTobeEdited,
      content: `github-fresco: ${dateObject.getTime()}_${i}_${Math.random()}`,
    });
  }
  shell.exec(makeCommitCommand({ formattedDate: formatDate(dateObject) }));
};

const emptyWeek = [["0"], ["0"], ["0"], ["0"], ["0"], ["0"], ["0"]];
export const drawShape = ({
  shape2dArray = emptyWeek,
  startingDate = STARTING_DATE,
}: {
  shape2dArray: string[][];
  startingDate: Date;
}): void => {
  const commitDate = copyDate(startingDate);
  for (let m = 0; m < shape2dArray.length; m++) {
    for (let n = 0; n < 7; n++) {
      makeCommitsAtDate({
        dateObject: commitDate,
        commitsPerDay: shape2dArray[n][m] === "1" ? 1 : 0,
        fileTobeEdited: "a.txt",
      });
      incrementDate({ dateObject: commitDate, incrementBy: 1 });
    }
  }
};

export const fillDays = ({
  startingDate = STARTING_DATE,
  totalDays = TOTAL_DAYS,
  commitsPerDay = COMMIT_PER_DAY,
}: {
  startingDate: Date;
  totalDays: number;
  commitsPerDay: number | number[];
}) => {
  const commitDate = copyDate(startingDate);
  for (let i = 0; i < totalDays; i++) {
    makeCommitsAtDate({
      dateObject: commitDate,
      commitsPerDay: commitsPerDay as number,
      fileTobeEdited: "a.txt",
    });
    incrementDate({ dateObject: commitDate, incrementBy: 1 });
  }
};
