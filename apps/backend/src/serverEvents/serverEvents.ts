type ServerEventTypes =
  | "ARTIST_PROFILE_CREATED"
  | "ARTIST_PROFILE_DELETED"
  | "ARTIST_PROFILE_UPDATED"
  | "TRACK_PROFILE_CREATED"
  | "TRACK_PROFILE_DELETED"
  | "TRACK_PROFILE_UPDATED"
  | "USER_CREATED"
  | "USER_DELETED"
  | "USER_UPDATED"
  | "IMAGE_UPLOADED"
  | "EMAIL_CHANGE_INITIATED"
  | "EMAIL_CHANGE_CONFIRMED"
  | "EMAIL_CHANGE_CANCELLED";

interface BaseEventPayload {
  eventType: ServerEventTypes;
}

interface CreationEventPayload extends BaseEventPayload {
  createdBy: string;
  createdAt: string;
}

interface DeletionEventPayload extends BaseEventPayload {
  deletedBy: string;
  deletedAt: string;
}

interface UpdateEventPayload extends BaseEventPayload {
  updatedBy: string;
  updatedAt: string;
}

export interface ArtistProfileCreatedEventPayload extends CreationEventPayload {
  eventType: "ARTIST_PROFILE_CREATED";
  artistId: string;
  artistName: string;
}

export interface ArtistProfileDeletedEventPayload extends DeletionEventPayload {
  eventType: "ARTIST_PROFILE_DELETED";
  artistId: string;
}

export interface ArtistProfileUpdatedEventPayload extends UpdateEventPayload {
  eventType: "ARTIST_PROFILE_UPDATED";
  artistId: string;
}

export interface TrackProfileCreatedEventPayload extends CreationEventPayload {
  eventType: "TRACK_PROFILE_CREATED";
  trackId: string;
  trackTitle: string;
}

export interface TrackProfileDeletedEventPayload extends DeletionEventPayload {
  eventType: "TRACK_PROFILE_DELETED";
  trackId: string;
}

export interface TrackProfileUpdatedEventPayload extends UpdateEventPayload {
  eventType: "TRACK_PROFILE_UPDATED";
  trackId: string;
}

export interface ImageUploadedEventPayload extends BaseEventPayload {
  eventType: "IMAGE_UPLOADED";
  imageId: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface UserCreatedEventPayload extends BaseEventPayload {
  eventType: "USER_CREATED";
  username: string;
  createdAt: string;
}

export interface UserDeletedEventPayload extends DeletionEventPayload {
  eventType: "USER_DELETED";
  userId: string;
}

export interface UserUpdatedEventPayload extends UpdateEventPayload {
  eventType: "USER_UPDATED";
  userId: string;
}

export interface EmailChangeInitiatedEventPayload extends BaseEventPayload {
  eventType: "EMAIL_CHANGE_INITIATED";
  userId: string;
  maskedNewEmail: string;
  ip: string;
  initiatedAt: string;
}

export interface EmailChangeConfirmedEventPayload extends BaseEventPayload {
  eventType: "EMAIL_CHANGE_CONFIRMED";
  userId: string;
  confirmedAt: string;
}

export interface EmailChangeCancelledEventPayload extends BaseEventPayload {
  eventType: "EMAIL_CHANGE_CANCELLED";
  userId: string;
  cancelledAt: string;
}

export type ServerEventPayload =
  | ArtistProfileCreatedEventPayload
  | ArtistProfileDeletedEventPayload
  | ArtistProfileUpdatedEventPayload
  | TrackProfileCreatedEventPayload
  | TrackProfileDeletedEventPayload
  | TrackProfileUpdatedEventPayload
  | UserCreatedEventPayload
  | UserDeletedEventPayload
  | UserUpdatedEventPayload
  | ImageUploadedEventPayload
  | EmailChangeInitiatedEventPayload
  | EmailChangeConfirmedEventPayload
  | EmailChangeCancelledEventPayload;

export const createArtistProfileCreatedEvent = (
  artistId: string,
  artistName: string,
  createdBy: string,
): ArtistProfileCreatedEventPayload => {
  return {
    eventType: "ARTIST_PROFILE_CREATED",
    artistId,
    artistName,
    createdBy,
    createdAt: new Date().toISOString(),
  };
};

export const createArtistProfileDeletedEvent = (
  artistId: string,
  deletedBy: string,
): ArtistProfileDeletedEventPayload => {
  return {
    eventType: "ARTIST_PROFILE_DELETED",
    artistId,
    deletedBy,
    deletedAt: new Date().toISOString(),
  };
};

export const createArtistProfileUpdatedEvent = (
  artistId: string,
  updatedBy: string,
): ArtistProfileUpdatedEventPayload => {
  return {
    eventType: "ARTIST_PROFILE_UPDATED",
    artistId,
    updatedBy,
    updatedAt: new Date().toISOString(),
  };
};

export const createImageUploadedEvent = (
  imageId: string,
  uploadedBy: string,
): ImageUploadedEventPayload => {
  return {
    eventType: "IMAGE_UPLOADED",
    imageId,
    uploadedBy,
    uploadedAt: new Date().toISOString(),
  };
};

export const createTrackProfileCreatedEvent = (
  trackId: string,
  trackTitle: string,
  createdBy: string,
): TrackProfileCreatedEventPayload => {
  return {
    eventType: "TRACK_PROFILE_CREATED",
    trackId,
    trackTitle,
    createdBy,
    createdAt: new Date().toISOString(),
  };
};

export const createTrackProfileDeletedEvent = (
  trackId: string,
  deletedBy: string,
): TrackProfileDeletedEventPayload => {
  return {
    eventType: "TRACK_PROFILE_DELETED",
    trackId,
    deletedBy,
    deletedAt: new Date().toISOString(),
  };
};

export const createTrackProfileUpdatedEvent = (
  trackId: string,
  updatedBy: string,
): TrackProfileUpdatedEventPayload => {
  return {
    eventType: "TRACK_PROFILE_UPDATED",
    trackId,
    updatedBy,
    updatedAt: new Date().toISOString(),
  };
};

export const createUserCreatedEvent = (
  username: string,
): UserCreatedEventPayload => {
  return {
    eventType: "USER_CREATED",
    username,
    createdAt: new Date().toISOString(),
  };
};

export const createUserDeletedEvent = (
  userId: string,
  deletedBy: string,
): UserDeletedEventPayload => {
  return {
    eventType: "USER_DELETED",
    userId,
    deletedBy,
    deletedAt: new Date().toISOString(),
  };
};

export const createUserUpdatedEvent = (
  userId: string,
  updatedBy: string,
): UserUpdatedEventPayload => {
  return {
    eventType: "USER_UPDATED",
    userId,
    updatedBy,
    updatedAt: new Date().toISOString(),
  };
};

export const logServerEvent = (event: ServerEventPayload) => {
  console.info(event);
};

export const createEmailChangeInitiatedEvent = (
  userId: string,
  maskedNewEmail: string,
  ip: string,
): EmailChangeInitiatedEventPayload => ({
  eventType: "EMAIL_CHANGE_INITIATED",
  userId,
  maskedNewEmail,
  ip,
  initiatedAt: new Date().toISOString(),
});

export const createEmailChangeConfirmedEvent = (
  userId: string,
): EmailChangeConfirmedEventPayload => ({
  eventType: "EMAIL_CHANGE_CONFIRMED",
  userId,
  confirmedAt: new Date().toISOString(),
});

export const createEmailChangeCancelledEvent = (
  userId: string,
): EmailChangeCancelledEventPayload => ({
  eventType: "EMAIL_CHANGE_CANCELLED",
  userId,
  cancelledAt: new Date().toISOString(),
});
