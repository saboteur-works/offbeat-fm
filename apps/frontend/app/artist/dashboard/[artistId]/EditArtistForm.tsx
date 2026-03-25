"use client";
import React from "react";
import editArtistData from "../../../../actions/editArtistData";
import { Button, ErrorText, FormLabel, ImgContainer } from "@mda/components";
import { Formik, Field } from "formik";
import toast from "react-hot-toast";
import { socialPlatformLinks } from "@common/json-data";
import type { SocialPlatformLinks } from "@common/json-data";
import { artistFormValidators } from "@common/validation";
import { ClientEditableArtist } from "@common/types/src/types";
import resizeImage from "../../../../util/resizeImg";
import useGenres from "../../../../swrHooks/useGenres";
interface EditArtistFormValues {
  artistArt: File;
  artistName: string;
  genre: string;
  biography: string;
  links?: {
    [key in SocialPlatformLinks]: string;
  };
}

export default function EditArtistForm({
  artistData,
  artistId,
  setArtistDataAction,
  setEditArtistDataAction,
}: {
  artistData?: ClientEditableArtist;
  artistId: string;
  setArtistDataAction: React.Dispatch<
    React.SetStateAction<ClientEditableArtist | undefined>
  >;
  setEditArtistDataAction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { genres, genresLoading, genreLoadError } = useGenres();

  const initialValues: EditArtistFormValues = {
    artistArt: null,
    artistName: artistData?.name || "",
    genre: artistData?.genre || "",
    biography: artistData?.biography || "",
    links: Object.keys(socialPlatformLinks).reduce(
      (acc, platform) => {
        if (artistData?.links && artistData.links[platform]) {
          acc[platform] = artistData.links[platform];
        }
        return acc;
      },
      {} as { [key in SocialPlatformLinks]: string },
    ),
  };

  if (genreLoadError) {
    return (
      <div>
        There was an error loading genre data for this form. Please try again
        later or contact support.
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={artistFormValidators.editArtistSchema}
      onSubmit={async (values) => {
        try {
          console.log("Submitting values:", values);
          const updateData = await editArtistData(artistId, {
            name: values.artistName,
            genre: values.genre,
            biography: values.biography,
            artistArt:
              values.artistArt instanceof File ? values.artistArt : undefined,
            links: values.links,
          });
          toast.success("Artist updated successfully");
          setArtistDataAction(updateData);
          setEditArtistDataAction?.(false);
        } catch (error) {
          console.error("Error updating artist:", error);
          toast.error("Error updating artist");
          return;
        }
      }}
    >
      {({ handleSubmit, setFieldValue, errors, touched }) => (
        <form
          className="flex flex-col gap-4 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          encType="multipart/form-data"
        >
          <FormLabel>
            <Field
              type="text"
              name="artistName"
              id="artistName"
              placeholder="Update your Artist Name"
              className="w-full"
            />
          </FormLabel>
          {errors.artistName && touched.artistName ? (
            <ErrorText message={errors.artistName} />
          ) : null}

          <FormLabel>
            <input
              type="file"
              name="artistArt"
              id="artistArt"
              accept="image/*"
              className="text-transparent file:text-gray-300 file:border file:border-gray-700 file:transition-colors file:px-4 file:py-2 file:rounded file:hover:text-white file:hover:text-shadow-md/100 file:hover:bg-gray-800"
              onChange={async (event) => {
                const resized = await resizeImage(event.currentTarget.files[0]);
                setFieldValue("artistArt", resized);
              }}
            />
          </FormLabel>
          <ImgContainer
            src={
              artistData.artistArt
                ? `data:image/jpeg;base64,${artistData.artistArt}`
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
              id="biography"
              placeholder="Update your biography"
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
                {errors.links && touched.links && errors.links[platform] ? (
                  <ErrorText message={errors.links[platform]} />
                ) : null}
              </div>
            ))}
          <div className="flex gap-4">
            <Button label="Save Changes" type="submit" category="primary" />
            <Button
              label="Cancel"
              category="outline"
              onClick={() => setEditArtistDataAction?.(false)}
            />
          </div>
        </form>
      )}
    </Formik>
  );
}
