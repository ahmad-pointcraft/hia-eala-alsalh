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
  async createAnnouncement(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async updateAnnouncement(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async deleteAnnouncement(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async reorderAnnouncements(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async listEvents(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async createEvent(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async updateEvent(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async deleteEvent(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async listDonations(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async createDonationCampaign(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async updateDonationCampaign(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async deleteDonationCampaign(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async setActiveDonationCampaign(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async uploadImage(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async listImages(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async deleteImage(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  async reorderCarouselImages(): Promise<never> { throw new Error(NOT_IMPLEMENTED); }
  subscribe(): () => void { return () => { /* noop */ }; }
}
