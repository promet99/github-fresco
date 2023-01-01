import shell from "shelljs";

export const moveToDir = ({ dirname }: { dirname: string }): void => {
  shell.cd(dirname);
};

export const writeToFile = ({
  file,
  content,
}: {
  file: string;
  content: string | number;
}): void => {
  shell.exec(`echo ${content} > ${file}`);
};
