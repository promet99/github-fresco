const heart = `
00000000
11110111
00100100
00100111
10100001
11100111
00000000
`;
// github-fresco: 1614556800000_1_0.123456789
// number above mean:
const greatPainting = `
000000000000000000000000000000000000000000000000000
001100101110101010101100000111011001110111011100110
010000100100101010101010000100010101000100010001010
010110100100111010101100110111011001110111010001010
010010100100101010101010000100010101000001010001010
001100100100101011101100000100010101110111011101100
000000000000000000000000000000000000000000000000000
`;

const splitShape = (shape: string) =>
  shape
    .split("\n")
    .filter((e) => e.length > 0)
    .map((e) => e.split(""));

const splitFilterShape = (shape: string): (0 | 1)[] => {
  const b = shape
    .split("\n")
    .filter((e) => e.length > 0)
    .map((e) => e.split(""));

  const aa = b[0]
    .map((e, i) => {
      return b.map((ee) => ee[i]);
    })
    .flat()
    .map((k) => (k === "0" ? 0 : 1));

  return aa;
};

export const GP = splitFilterShape(greatPainting);
export const HEART = splitShape(heart);
