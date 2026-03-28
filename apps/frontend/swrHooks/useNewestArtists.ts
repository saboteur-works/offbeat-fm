import useSWR from "swr";
import axiosInstance from "../util/axiosInstance";

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data.data);

export default function useNewestArtists() {
  const { data, error, isLoading } = useSWR("/artists/newest", fetcher, {
    revalidateOnFocus: false,
  });
  return { newestArtists: data, isLoading, error };
}
