import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function mergeMaps(...files) {
  const out = {};
  for (const f of files) {
    Object.assign(out, JSON.parse(fs.readFileSync(path.join(__dirname, f), "utf8")));
  }
  return out;
}

const ch3 = mergeMaps("map-ch3-part1.json", "map-ch3-part2.json");
fs.writeFileSync(path.join(__dirname, "map-ch3.json"), JSON.stringify(ch3, null, 2));
console.log("map-ch3.json keys:", Object.keys(ch3).length);
