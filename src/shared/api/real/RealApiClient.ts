import type { ApiClient } from '../contract';

const NOT_IMPLEMENTED = 'not implemented — Spec 017';

// REAL API CLIENT STUB — closure factory, no `this`; every method throws until Spec 017
export function createRealApiClient(): ApiClient {
  const unimplemented = (): never => {
    throw new Error(NOT_IMPLEMENTED);
  };

  return {
    signIn: unimplemented,
    signUp: unimplemented,
    signOut: unimplemented,
    getSession: unimplemented,
    registerDevice: unimplemented,
    getDeviceStatus: unimplemented,
    pairDevice: unimplemented,
    listDevices: unimplemented,
    unpairDevice: unimplemented,
    renameDevice: unimplemented,
    getMasjidConfig: unimplemented,
    updateMasjidConfig: unimplemented,
    listAnnouncements: unimplemented,
    createAnnouncement: unimplemented,
    updateAnnouncement: unimplemented,
    deleteAnnouncement: unimplemented,
    reorderAnnouncements: unimplemented,
    listEvents: unimplemented,
    createEvent: unimplemented,
    updateEvent: unimplemented,
    deleteEvent: unimplemented,
    listDonations: unimplemented,
    createDonationCampaign: unimplemented,
    updateDonationCampaign: unimplemented,
    deleteDonationCampaign: unimplemented,
    setActiveDonationCampaign: unimplemented,
    uploadImage: unimplemented,
    listImages: unimplemented,
    deleteImage: unimplemented,
    reorderCarouselImages: unimplemented,
    subscribe: () => () => { /* noop */ },
  };
}
