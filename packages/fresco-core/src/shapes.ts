const heart = `
00000000
11110111
00100100
00100111
10100001
11100111
00000000
`;

const splitShape = (shape: string) =>
  shape
    .split("\n")
    .filter((e) => e.length > 0)
    .map((e) => e.split(""));

export const HEART = splitShape(heart);
