"use client";
import { use } from "react";
import submitTrack from "../../../../../actions/submitTrack";
import { useRouter } from "next/navigation";
import { Button, ErrorText, ImgContainer } from "@mda/components";
import { Formik, Field } from "formik";
import toast from "react-hot-toast";
import useSWR from "swr";
import axiosInstance from "../../../../../util/axiosInstance";
import { musicPlatformLinks, MusicPlatformLinks } from "@common/json-data";
import useAuth from "../../../../../swrHooks/useAuth";
import AccessUnauthorized from "../../../../../commonComponents/AccessUnauthorized";
import { trackFormValidators } from "@common/validation";
import resizeImage from "../../../../../util/resizeImg";
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);
interface TrackFormValues {
  title: string;
  genre: string;
  isrc?: string;
  trackArt?: File;
  links?: {
    [key in MusicPlatformLinks]?: string;
  };
}

export default function AddTrackPage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const artistId = use(params).artistId;
  const router = useRouter();
  const { isLoading: isAuthLoading, error: isAuthError } = useAuth();

  const { data: genreData, error, isLoading } = useSWR(`genre`, fetcher);
  if (isLoading || isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading genre data.</div>;
  }

  if (isAuthError) {
    return <AccessUnauthorized />;
  }

  const initialValues: TrackFormValues = {
    title: "",
    genre: "",
    isrc: "",
    trackArt: undefined,
    links: Object.keys(musicPlatformLinks).reduce(
      (acc, platform) => ({
        ...acc,
        [platform]: "",
      }),
      {} as { [key in MusicPlatformLinks]?: string },
    ),
  };

  return (
    <div className="w-full p-4 overflow-y-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={trackFormValidators.clientCreateTrackSchema}
        onSubmit={async (values) => {
          try {
            const trackSubmissionData = {
              title: values.title,
              genre: values.genre,
              isrc: values.isrc,
              artistId: artistId,
              trackArt:
                values.trackArt instanceof File ? values.trackArt : undefined,
              links: values.links,
            };
            const response = await submitTrack(trackSubmissionData);
            if (response.status === 201) {
              toast.success("Track added successfully");
              router.push(`/artist/dashboard/${artistId}`);
            }
          } catch (error) {
            console.error("Error submitting track:", error);
            toast.error("Error submitting track");
          }
        }}
      >
        {({ handleSubmit, setFieldValue, values, errors, touched }) => (
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-4">Add New Track</h1>
            <label htmlFor="title">Track Title</label>
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
                  ? URL.createObjectURL(values.trackArt)
                  : undefined
              }
            />
            <label htmlFor="genre">Genre</label>
            <Field
              id="genre"
              as="select"
              name="genre"
              className="bg-gray-500 rounded py-2 px-3"
            >
              <option value="">Select a genre</option>
              {genreData?.genres.map((genre: string) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </Field>
            {errors.genre && touched.genre ? (
              <ErrorText message={errors.genre} />
            ) : null}
            <label htmlFor="isrc">ISRC</label>
            <Field id="isrc" type="text" name="isrc" />
            {errors.isrc && touched.isrc ? (
              <ErrorText message={errors.isrc} />
            ) : null}
            <p className="text-xl font-bold">Links</p>
            {Object.keys(musicPlatformLinks).map((platform) => (
              <div key={platform} className="flex flex-col mb-2">
                <label htmlFor={`links.${platform}`} className="mb-2">
                  {platform}
                </label>
                <Field id={platform} type="text" name={`links.${platform}`} />
                {errors.links &&
                touched.links &&
                errors.links[platform] &&
                touched.links[platform] ? (
                  <ErrorText message={errors.links[platform]} />
                ) : null}
              </div>
            ))}

            <div className="flex gap-4">
              <Button label="Add Track" type="submit" category="primary" />
              <Button
                label="Cancel"
                onClick={() => router.push(`/artist/dashboard/${artistId}`)}
                category="outline"
              />
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
