/* ------------------ GENERATES A UNIQUE PREFIXED ID STRING ------------------ */
export const generateId = (prefix: string): string => `${prefix}-${crypto.randomUUID()}`;

/* ------------------ GENERATES A 6-DIGIT NUMERIC CODE STRING ------------------ */
export const generateNumericCode = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

