/* ------------------ GENERATES A UNIQUE PREFIXED ID STRING ------------------ */
export const generateId = (prefix: string): string => `${prefix}-${crypto.randomUUID()}`;

/* ------------------ GENERATES A 6-DIGIT NUMERIC CODE STRING ------------------ */
// Crypto-sourced, not Math.random — pairing and invite codes gate access.
export const generateNumericCode = (): string => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(100000 + ((buf[0] ?? 0) % 900000));
};

