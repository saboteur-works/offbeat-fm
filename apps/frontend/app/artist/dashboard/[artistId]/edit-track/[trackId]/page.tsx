"use client";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import submitEditTrack from "../../../../../../actions/submitEditTrack";
import { Formik, Field } from "formik";
import { Button, ErrorText, ImgContainer } from "@mda/components";
import axiosInstance from "../../../../../../util/axiosInstance";
import useSWR from "swr";
import deleteTrack from "../../../../../../actions/deleteTrack";
import toast from "react-hot-toast";
import { musicPlatformLinks, MusicPlatformLinks } from "@common/json-data";
import useAuth from "../../../../../../swrHooks/useAuth";
import AccessUnauthorized from "../../../../../../commonComponents/AccessUnauthorized";
import useGenres from "../../../../../../swrHooks/useGenres";
import { trackFormValidators } from "@common/validation";
import resizeImage from "../../../../../../util/resizeImg";

interface TrackFormValues {
  title: string;
  genre: string;
  isrc?: string;
  trackArt?: File;
  links?: {
    [key in MusicPlatformLinks]: string;
  };
}

const fetcher = (url: string) =>
  axiosInstance.get(url, { withCredentials: true }).then((res) => res.data);
export default function EditTrackPage({
  params,
}: {
  params: Promise<{ artistId: string; trackId: string }>;
}) {
  const trackId = use(params).trackId;
  const artistId = use(params).artistId;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { isLoading: isAuthLoading, error: isAuthError } = useAuth();
  const { genres, genresLoading, genreLoadError } = useGenres();
  const { data, error, isLoading } = useSWR(
    `tracks/${trackId}?withLinks=true`,
    fetcher,
  );
  const router = useRouter();
  if (isLoading || isAuthLoading || genresLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading track data.</div>;
  }
  if (isAuthError) {
    return <AccessUnauthorized />;
  }
  if (genreLoadError) {
    return (
      <div>
        There was an error loading genre data for this form. Please try again
        later or contact support.
      </div>
    );
  }

  const initialValues: TrackFormValues = {
    title: data.data.title,
    genre: data.data.genre,
    isrc: data.data.isrc || undefined,
    trackArt: null,
    links: Object.keys(data.data.links).reduce((acc, key) => {
      acc[key] = data.data.links[key];
      return acc;
    }, {}) as {
      [key in MusicPlatformLinks]: string;
    },
  };

  return (
    <div className="w-full p-4 overflow-y-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={trackFormValidators.clientUpdateTrackSchema}
        onSubmit={async (values) => {
          const editData = {
            title: values.title,
            genre: values.genre,
            isrc: values.isrc,
            artistId: artistId,
            trackArt:
              values.trackArt instanceof File ? values.trackArt : undefined,
            links: values.links,
          };
          const response = await submitEditTrack(trackId, editData);
          if (response.status === 200) {
            toast.success("Track edited successfully");
            router.push(`/artist/dashboard/${artistId}`);
          } else {
            toast.error("Error editing track");
          }
        }}
      >
        {({ handleSubmit, setFieldValue, values, errors, touched }) => (
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" />
            {errors.title && touched.title ? (
              <ErrorText message={errors.title} />
            ) : null}
            <label htmlFor="trackArt">Track Art</label>
            <input
              id="trackArt"
              type="file"
              accept="image/*"
              name="trackArt"
              className="text-transparent file:text-gray-300 file:border file:border-gray-700 file:transition-colors file:px-4 file:py-2 file:rounded file:hover:text-white file:hover:text-shadow-md/100 file:hover:bg-gray-800"
              onChange={async (event) => {
                const resized = await resizeImage(event.currentTarget.files[0]);
                setFieldValue("trackArt", resized);
              }}
            />
            <ImgContainer
              src={
                values.trackArt
                  ? URL.createObjectURL(values?.trackArt)
                  : undefined
              }
            />
            <label>Genre</label>
            <Field id="genre" as="select" name="genre">
              <option value="">Select a genre</option>
              {genres &&
                genres.genres.map((genre: string) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
            </Field>
            {errors.genre && touched.genre ? (
              <ErrorText message={errors.genre} />
            ) : null}

            <label>ISRC</label>
            <Field id="isrc" type="text" name="isrc" />
            <p>Links</p>
            {Object.keys(musicPlatformLinks)
              .filter((link) => link !== "Bandcamp")
              .map((link) => (
                <div key={link} className="flex flex-col">
                  <label htmlFor={link}>{link}</label>
                  <Field id={link} type="text" name={`links.${link}`} />
                </div>
              ))}

            <div className="flex gap-4">
              <Button label="Submit" type="submit" />
              <Button
                label="Delete Track"
                category="secondary"
                onClick={() => setConfirmDelete(true)}
              />
              <Button
                label="Cancel"
                category="secondary"
                onClick={() => router.push(`/artist/dashboard/${artistId}`)}
              />
            </div>
            {confirmDelete && (
              <div className="mt-4">
                <p>Are you sure you want to delete this track?</p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="bg-red-700 text-white p-2 mt-2 rounded"
                    onClick={async () => {
                      await deleteTrack(trackId);
                      setConfirmDelete(false);
                      toast.success("Track deleted successfully");
                      router.push(`/artist/dashboard/${artistId}`);
                    }}
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 text-white p-2 mt-2 rounded"
                    onClick={async () => {
                      setConfirmDelete(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </Formik>
    </div>
  );
}
