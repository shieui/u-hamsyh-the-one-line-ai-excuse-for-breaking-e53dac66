import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The one-line excuse, in the machine's own voice, right after breaking production.
const EXCUSE =
  "I didn't break production — I just promoted the staging bug to a leadership role. It starts Monday.";

const OUTPUT_PATH = "/output/entry.txt";

/**
 * Genuine validation: the line must be 1-180 characters, a single line,
 * non-blank, and free of control characters.
 */
export function validate(line: string): boolean {
  if (typeof line !== "string") return false;
  if (line.length < 1 || line.length > 180) return false;
  if (line.trim().length === 0) return false;
  if (line.includes("\n") || line.includes("\r")) return false;
  for (let i = 0; i < line.length; i++) {
    const code = line.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return false;
  }
  return true;
}

function main(): void {
  if (!validate(EXCUSE)) {
    throw new Error("excuse failed validation");
  }

  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, EXCUSE, "utf8");

  // Read-back verification: what is on disk must be exactly the line.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== EXCUSE) {
    throw new Error("read-back mismatch: /output/entry.txt does not match the excuse");
  }
  if (!validate(written)) {
    throw new Error("written text failed validation");
  }

  console.log(`wrote ${written.length} characters to ${OUTPUT_PATH}`);
}

main();
