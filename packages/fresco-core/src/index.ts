#!/usr/bin/env node

// TODO: try bin
// TODO: add loading bar

import shell from "shelljs";

shell.config.silent = true;

export const Shell = shell;

export * from "./gitActions.js";
export * from "./constants.js";
export * from "./shellActions.js";
export { GP } from "./shapes.js";
