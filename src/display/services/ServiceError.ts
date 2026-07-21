export class ServiceError extends Error {
  constructor(
    public readonly feature: string,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(`[${feature}] ${message}`);
    this.name = 'ServiceError';
  }
}
