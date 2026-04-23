import { IEditorialProfile } from "@common/types/src/types";
import { Document, Model, Schema, model } from "mongoose";

export interface IEditorialProfileDoc extends IEditorialProfile, Document {}

const EditorialProfileSchema: Schema<
  IEditorialProfileDoc,
  Model<IEditorialProfileDoc>
> = new Schema(
  {
    name: { type: String, required: true },
    genre: { type: String, required: true },
    biography: { type: String },
    artistArt: { type: String },
    editorialNotes: { type: String },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified"],
      default: "unverified",
    },
    claimStatus: {
      type: String,
      enum: ["unclaimed", "claimed", "converted"],
      default: "unclaimed",
    },
    claimedByUserId: { type: String },
    convertedArtistId: { type: String },
    createdByAdminId: { type: String, required: true },
  },
  { timestamps: true },
);

const EditorialProfile = model<IEditorialProfileDoc, Model<IEditorialProfileDoc>>(
  "EditorialProfile",
  EditorialProfileSchema,
);

export default EditorialProfile;
