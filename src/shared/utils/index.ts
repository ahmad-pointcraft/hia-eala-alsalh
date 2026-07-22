export const generateId = (prefix: string): string => `${prefix}-${crypto.randomUUID()}`;
