/* ------------------ GENERATES A UNIQUE PREFIXED ID STRING ------------------ */
export const generateId = (prefix: string): string => `${prefix}-${crypto.randomUUID()}`;
