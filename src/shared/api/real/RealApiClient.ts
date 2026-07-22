import type { ApiClient } from '../contract';

const NOT_IMPLEMENTED = 'not implemented — Spec 017';

export class RealApiClient implements ApiClient {
  async signIn(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async signUp(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async signOut(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async getSession(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async registerDevice(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async getDeviceStatus(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async pairDevice(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async listDevices(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async unpairDevice(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async renameDevice(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async getMasjidConfig(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async updateMasjidConfig(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async listAnnouncements(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async listEvents(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async listDonations(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  subscribe(): () => void { return () => { /* noop */ }; }
}
