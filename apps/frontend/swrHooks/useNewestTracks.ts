import useSWR from "swr";
import axiosInstance from "../util/axiosInstance";

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data.data);

export default function useNewestTracks() {
  const { data, error, isLoading } = useSWR("/tracks/newest", fetcher, {
    revalidateOnFocus: false,
  });
  return { newestTracks: data, isLoading, error };
}
