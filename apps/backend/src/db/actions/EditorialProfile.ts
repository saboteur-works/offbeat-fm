import { IEditorialProfile } from "@common/types/src/types";
import EditorialProfile from "../models/EditorialProfile";
import Artist from "../models/Artist";

type CreateEditorialProfileData = Pick<
  IEditorialProfile,
  "name" | "genre" | "biography" | "editorialNotes"
>;

type UpdateEditorialProfileData = Partial<CreateEditorialProfileData> & {
  verificationStatus?: IEditorialProfile["verificationStatus"];
  links?: IEditorialProfile["links"];
};

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

export const getEditorialProfileBySlug = async (slug: string) => {
  return EditorialProfile.findOne({ slug });
};

export const updateEditorialProfile = async (
  id: string,
  data: UpdateEditorialProfileData,
) => {
  return EditorialProfile.findByIdAndUpdate(id, data, { new: true });
};

export const addFavoriteEditorialProfile = async (
  profileId: string,
  username: string,
) => {
  return EditorialProfile.findByIdAndUpdate(
    profileId,
    { $addToSet: { favoritedBy: username } },
    { new: true },
  );
};

export const removeFavoriteEditorialProfile = async (
  profileId: string,
  username: string,
) => {
  return EditorialProfile.findByIdAndUpdate(
    profileId,
    { $pull: { favoritedBy: username } },
    { new: true },
  );
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

export const approveAndConvertEditorialProfile = async (profileId: string) => {
  const profile = await EditorialProfile.findById(profileId);
  if (!profile) throw new Error("Editorial profile not found");
  if (profile.claimStatus !== "claimed") {
    throw new Error("Profile must be in claimed status to convert");
  }
  if (!profile.claimedByUserId) {
    throw new Error("Profile has no claiming user");
  }

  const artist = new Artist({
    name: profile.name,
    genre: profile.genre,
    biography: profile.biography,
    links: profile.get("links") as Record<string, string> | undefined,
    artistArt: profile.artistArt ?? null,
    managingUserId: profile.claimedByUserId,
  });
  await artist.save();

  await EditorialProfile.findByIdAndUpdate(profileId, {
    claimStatus: "converted",
    convertedArtistId: artist._id,
  });

  return artist.toJSON({ flattenMaps: true });
};
