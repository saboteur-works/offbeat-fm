"use client";

import { Formik, Field } from "formik";
import {
  BodyTypography,
  Button,
  ErrorText,
  FormLabel,
  ImgContainer,
  TechnicalTypography,
} from "@mda/components";
import axiosInstance from "../../../util/axiosInstance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useGenres from "../../../swrHooks/useGenres";
import { SocialPlatformLinks, socialPlatformLinks } from "@common/json-data";
import { artistFormValidators } from "@common/validation";
import resizeImage from "../../../util/resizeImg";
interface ArtistSignupFormValues {
  artistName: string;
  genre: string;
  biography: string;
  artistArt?: File;
  links?: {
    [key in SocialPlatformLinks]?: string;
  };
}

export default function ArtistSignup() {
  const { genres, genresLoading, genreLoadError } = useGenres();
  const router = useRouter();
  const initialValues: ArtistSignupFormValues = {
    artistName: "",
    genre: "",
    biography: "",
    artistArt: null,
    links: Object.keys(socialPlatformLinks).reduce(
      (acc, key) => {
        acc[key as SocialPlatformLinks] = "";
        return acc;
      },
      {} as { [key in SocialPlatformLinks]?: string },
    ),
  };

  if (genresLoading) {
    return <div>Loading...</div>;
  }

  if (genreLoadError) {
    return <div>Error loading genres</div>;
  }

  return (
    <div className="mt-4 overflow-y-auto">
      <h1 className="">Artist Setup</h1>
      <BodyTypography text="Welcome to the artist setup page! Please fill out the form below to create your artist profile. This information will help us showcase your music and connect you with fans." />
      <TechnicalTypography text="By complete this form, you assert that:" />
      <ul className="list-disc list-inside">
        <li>
          You are the rightful owner or have the necessary rights to manage the
          artist profile.
        </li>
        <li>You have released music under the artist's name.</li>
        <li>You agree to our terms of service and privacy policy.</li>
        <li>You will provide accurate and truthful information.</li>
      </ul>
      <Formik
        initialValues={initialValues}
        validationSchema={artistFormValidators.artistSignupSchema}
        onSubmit={async (values) => {
          try {
            const artistSubmissionData = {
              name: values.artistName,
              genre: values.genre,
              biography: values.biography,
              links: Object.keys(values.links || {}).reduce(
                (acc, key) => {
                  const value = values.links?.[key];
                  if (value && value !== "") {
                    acc[key] = value;
                  }
                  return acc;
                },
                {} as Record<string, string>,
              ),
              artistArt:
                values.artistArt instanceof File ? values.artistArt : undefined,
            };
            await axiosInstance.post(`/artists`, artistSubmissionData, {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            toast.success("Artist profile created successfully");
            router.push("/artist/dashboard");
          } catch (error) {
            console.error("Error saving artist profile:", error);
            toast.error("Error saving artist profile");
          }
        }}
      >
        {({ handleSubmit, setFieldValue, values, errors, touched }) => (
          <form
            className="flex flex-col space-y-4 w-md mt-4"
            onSubmit={handleSubmit}
          >
            <FormLabel>
              <Field
                id="artistName"
                type="text"
                name="artistName"
                placeholder="Enter your artist name"
                className="w-full"
              />
            </FormLabel>
            {errors.artistName && touched.artistName ? (
              <ErrorText message={errors.artistName} />
            ) : null}
            <FormLabel>
              <input
                id="artistArt"
                type="file"
                accept="image/*"
                name="artistArt"
                className="text-transparent file:text-gray-300 file:border file:border-gray-700 file:transition-colors file:px-4 file:py-2 file:rounded file:hover:text-white file:hover:text-shadow-md/100 file:hover:bg-gray-800"
                onChange={async (event) => {
                  const resized = await resizeImage(
                    event.currentTarget.files[0],
                  );
                  setFieldValue("artistArt", resized);
                }}
              />
            </FormLabel>
            <ImgContainer
              src={
                values.artistArt
                  ? URL.createObjectURL(values.artistArt)
                  : undefined
              }
            />
            <FormLabel>
              <Field id="genre" as="select" name="genre" className="w-full">
                <option value="">Select a genre</option>
                {genres.genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </Field>
            </FormLabel>
            {errors.genre && touched.genre ? (
              <ErrorText message={errors.genre} />
            ) : null}

            <FormLabel>
              <Field
                as="textarea"
                name="biography"
                placeholder="Enter your biography"
                className="w-full"
              />
            </FormLabel>
            {errors.biography && touched.biography ? (
              <ErrorText message={errors.biography} />
            ) : null}
            {Object.keys(socialPlatformLinks)
              .filter((platform) => platform !== "Bandcamp")
              .map((platform) => (
                <div key={platform} className="flex flex-col">
                  <FormLabel>
                    <Field
                      type="text"
                      name={`links.${platform}`}
                      id={`links.${platform}`}
                      placeholder={`Enter your ${platform} link`}
                      className="w-full"
                    />
                  </FormLabel>
                </div>
              ))}

            <Button
              label="Save Artist Profile"
              type="submit"
              category="primary"
            />
          </form>
        )}
      </Formik>
    </div>
  );
}
