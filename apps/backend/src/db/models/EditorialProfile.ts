import { IEditorialProfile } from "@common/types/src/types";
import { Document, Model, Schema, model } from "mongoose";

export interface IEditorialProfileDoc extends IEditorialProfile, Document {}

const EditorialProfileSchema: Schema<
  IEditorialProfileDoc,
  Model<IEditorialProfileDoc>
> = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    genre: { type: String, required: true },
    biography: { type: String },
    artistArt: { type: String },
    links: { type: Map, of: String, required: false },
    favoritedBy: { type: [String], default: [] },
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

EditorialProfileSchema.pre("validate", function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  next();
});

EditorialProfileSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as IEditorialProfile;
  if (update && update.name) {
    update.slug = String(update.name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    this.setUpdate(update);
  }
  next();
});

const EditorialProfile = model<IEditorialProfileDoc, Model<IEditorialProfileDoc>>(
  "EditorialProfile",
  EditorialProfileSchema,
);

export default EditorialProfile;
