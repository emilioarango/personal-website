import { execSync } from "node:child_process";

/**
 * Build stamp for the header subtitle ("Built from … at abc1234, 21 Nov 2026").
 * Vercel exposes the commit; local builds fall back to git. Both can be
 * missing (e.g. a tarball build), so the stamp degrades to the date alone.
 */
function commit(): string | undefined {
  const fromVercel = process.env.VERCEL_GIT_COMMIT_SHA;
  if (fromVercel) return fromVercel.slice(0, 7);
  try {
    return execSync("git rev-parse --short=7 HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return undefined;
  }
}

const date = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "America/Los_Angeles",
});

export const BUILD = {
  commit: commit(),
  date,
};
