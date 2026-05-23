export const FUNDRAISING_PRAYER_GAP_SECONDS = 1 * 60;
export const FUNDRAISING_MIN_SECONDS = 3;
export const FUNDRAISING_MAX_SECONDS = 6;

export function getRandomFundraisingDelay(): number {
  const range = FUNDRAISING_MAX_SECONDS - FUNDRAISING_MIN_SECONDS;
  const seconds = FUNDRAISING_MIN_SECONDS + Math.random() * range;
  return seconds * 1000;
}
