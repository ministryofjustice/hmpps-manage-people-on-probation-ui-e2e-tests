import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
export const ROOT_DIR = path.resolve(path.dirname(__filename), "..");
