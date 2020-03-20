#!/usr/bin/env node

import { isatty } from "tty";
import meow from "meow";
import Histify from ".";

process.stdin.resume();
process.stdin.setEncoding("utf8");

let data = "";

const onEnd = () => {
  //   const cli = meow(
  //     `
  // 	Usage
  // 	  $ echo "1,2,3,4" | histify

  // `
  //   );

  try {
    const histify = new Histify(data);
    process.stdout.write(histify.summary());
    process.exit(1);
  } catch (error) {
    process.stdout.write(error.message);
    process.exit(1);
  }
};

if (isatty(0)) {
  onEnd();
} else {
  process.stdin.on("data", chunk => (data += chunk));
  process.stdin.on("end", onEnd);
}
