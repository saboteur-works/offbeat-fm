import { IEditorialProfile } from "@common/types/src/types";
import EditorialProfile from "../models/EditorialProfile";

type CreateEditorialProfileData = Pick<
  IEditorialProfile,
  "name" | "genre" | "biography" | "editorialNotes"
>;

export const createEditorialProfile = async (
  adminUserId: string,
  data: CreateEditorialProfileData,
) => {
  const profile = new EditorialProfile({
    ...data,
    createdByAdminId: adminUserId,
    verificationStatus: "unverified",
    claimStatus: "unclaimed",
  });
  await profile.save();
  return profile;
};

export const getEditorialProfiles = async () => {
  return EditorialProfile.find().sort({ createdAt: -1 });
};

export const getEditorialProfileById = async (id: string) => {
  return EditorialProfile.findById(id);
};

export const updateEditorialProfile = async (
  id: string,
  data: Partial<CreateEditorialProfileData> & {
    verificationStatus?: IEditorialProfile["verificationStatus"];
    editorialNotes?: string;
  },
) => {
  return EditorialProfile.findByIdAndUpdate(id, data, { new: true });
};

export const deleteEditorialProfile = async (id: string) => {
  return EditorialProfile.findByIdAndDelete(id);
};

export const claimEditorialProfile = async (
  profileId: string,
  userId: string,
) => {
  const profile = await EditorialProfile.findById(profileId);
  if (!profile) throw new Error("Editorial profile not found");
  if (profile.claimStatus !== "unclaimed") {
    throw new Error("Profile has already been claimed or converted");
  }
  profile.claimStatus = "claimed";
  profile.claimedByUserId = userId;
  await profile.save();
  return profile;
};

export const convertEditorialProfile = async (
  profileId: string,
  artistId: string,
) => {
  return EditorialProfile.findByIdAndUpdate(
    profileId,
    { claimStatus: "converted", convertedArtistId: artistId },
    { new: true },
  );
};
