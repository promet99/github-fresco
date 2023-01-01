#!/usr/bin/env node

// TODO: try bin
// TODO: add loading bar

import shell from "shelljs";

shell.config.silent = true;

export const Shell = shell;

export * from "./gitActions";
export * from "./constants";
export * from "./shellActions";
