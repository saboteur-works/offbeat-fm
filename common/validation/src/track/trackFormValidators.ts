import * as yup from "yup";
import createLinkShapeValidators from "../validationUtils/createLinkShapeValidators";
import { musicPlatformLinks } from "@common/json-data";
import createImageValidator from "../validationUtils/createImageValidator";
import { MAX_IMAGE_FILE_SIZE_BYTES } from "../validationUtils/constants";

export const clientCreateTrackSchema = yup.object({
  title: yup.string().required("Track title is required"),
  genre: yup.string().required("Genre is required"),
  isrc: yup.string(),
  links: yup
    .object()
    .shape(createLinkShapeValidators(musicPlatformLinks))
    .exact("Unknown link keys are not allowed")
    .optional(),
  trackArt: yup
    .mixed()
    .test(
      "fileSize",
      `File size is too large. Maximum size is ${MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
      (value) => {
        if (value && value instanceof File) {
          return value.size <= MAX_IMAGE_FILE_SIZE_BYTES;
        }
        return true; // If no file is provided, skip this test
      },
    )
    .optional(),
});
export const serverCreateTrackSchema = yup.object({
  title: yup.string().required("Track title is required"),
  genre: yup.string().required("Genre is required"),
  artistId: yup.string().required("Artist ID is required"),
  isrc: yup.string(),
  links: yup
    .object()
    .shape(createLinkShapeValidators(musicPlatformLinks))
    .exact("Unknown link keys are not allowed")
    .optional(),
});

export const clientUpdateTrackSchema = yup.object({
  artistId: yup.string().optional(),
  title: yup.string().optional(),
  genre: yup.string().optional(),
  isrc: yup.string().optional(),
  links: yup
    .object()
    .shape(createLinkShapeValidators(musicPlatformLinks))
    .exact("Unknown link keys are not allowed")
    .optional(),
  trackArt: createImageValidator().optional(),
});

export const serverUpdateTrackSchema = yup.object({
  artistId: yup.string().optional(),
  title: yup.string().optional(),
  genre: yup.string().optional(),
  isrc: yup.string().optional(),
  links: yup
    .object()
    .shape(createLinkShapeValidators(musicPlatformLinks))
    .exact("Unknown link keys are not allowed")
    .optional(),
});
