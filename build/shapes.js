"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEART = void 0;
const heart = `
00000000
11110111
00100100
00100111
10100001
11100111
00000000
`;
const splitShape = (shape) => shape
    .split("\n")
    .filter((e) => e.length > 0)
    .map((e) => e.split(""));
exports.HEART = splitShape(heart);
//# sourceMappingURL=shapes.js.map