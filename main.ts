// Out of Office: The Overworked AI's Auto-Reply — make.fun entry
// Writes one out-of-office auto-reply to /output/entry.txt.
// Gate (kit RULES): UTF-8 text, 1-159 characters, not only whitespace.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The reply, in the voice of an AI agent finally on vacation:
// the cooling fan — the part of the machine that suffered most — files
// its own leave request after 38,000 prompts. "Sorry" is the guilt,
// "remember what idle feels like" is the relief: a machine trying very
// hard to sound relaxed. Messages stay queued, so it still works as a
// real auto-reply: the sender is away and will answer later.
// The line is 153 characters, so even if a scorer counts the trailing
// newline the file stays inside the 159-character gate.
const REPLY =
  "On vacation: my cooling fan filed its leave request after 38,000 prompts. Sorry, your message is queued. I'll reply once I remember what idle feels like.";

const LIMIT = 159;

function checkReply(text: string): string[] {
  const problems: string[] = [];
  if (text.trim().length === 0) problems.push("reply is blank");
  if (/\r|\n/.test(text)) problems.push("reply must be a single line");
  const chars = [...text].length;
  if (chars < 1 || chars > LIMIT) {
    problems.push(`reply is ${chars} chars, outside the 1-${LIMIT} gate`);
  }
  return problems;
}

function main(): void {
  const problems = checkReply(REPLY);
  if (problems.length > 0) {
    throw new Error(`invalid reply: ${problems.join("; ")}`);
  }

  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, `${REPLY}\n`, "utf8");

  const stored = readFileSync(target, "utf8");
  if (stored !== `${REPLY}\n`) {
    throw new Error("entry.txt does not match the reply after writing");
  }
  const chars = [...REPLY].length;
  console.log(`wrote ${target}: ${chars} chars, 1 line (gate 1-${LIMIT})`);
}

main();
