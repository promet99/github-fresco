# Github-fresco

## What is this for?

This is a piece of code that can be run or used as a library to fill your github contributions, or make them look like a painting.

As a monorepo, `fresco-core` does all the work, and you can conveniently run with `cli` package, it can be used to fill your github contributions.

=> This `fresco-core` does not yet work as a npm library (it will soon).

## How to use it?

For now, install will `pnpm`, and run with `pnpm start:cli`.
The code will initialize a git file under `./github-fresco` dir, and will fill it with commits, and push it.
All you need to do is to **make a new repo on github, and paste its .git url.**
For now, it will use your git credentials, but option to use custom email will be added soon.

> Note: If the repo is public, automated commits will be shown publicly. If you want to keep it private, make it private. 

## Why should I use it?

I expect one of below

- You want to impress someone, such as potential employer
- You want to make your github profile look like a painting
- You like color green (It is good for eyes)

## Future dev plans

- Cli does not yet support painting images, while it is implemented in `fresco-core`.
- Publish `fresco-core` to npm, so that anyone can use it in their code.
- Add option to use custom email. For now, it uses your git credentials.



P.S. This Readme is written by (major) help of github copilot, and it may have some mistakes. Please let me know if you find any.