export const FUNDRAISING_PRAYER_GAP_SECONDS = 1 * 60;
export const FUNDRAISING_MIN_SECONDS = 5 * 60; // 5 minutes
export const FUNDRAISING_MAX_SECONDS = 5 * 60; // 5 minutes

export function getRandomFundraisingDelay(): number {
  const range = FUNDRAISING_MAX_SECONDS - FUNDRAISING_MIN_SECONDS;
  const seconds = FUNDRAISING_MIN_SECONDS + Math.random() * range;
  return seconds * 1000;
}
