// global-teardown.ts
import fs from "fs";
import path from "path";
import { ROOT_DIR } from "./src/test/util/Paths";

const USER_FILE = path.join(ROOT_DIR, "temp-offender.json");

export default async () => {
  if (fs.existsSync(USER_FILE)) {
    fs.unlinkSync(USER_FILE);
    console.log("Deleted temp offender file:", USER_FILE);
  }
};
