import useSWR from "swr";
import axiosInstance from "../util/axiosInstance";
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);
export default function useAuth() {
  const { data, error, isLoading, isValidating } = useSWR("/auth/check-auth", fetcher, {
    revalidateOnFocus: false,
  });

  // If there's a cached error but SWR is actively revalidating, treat it as loading
  // rather than immediately surfacing AccessUnauthorized to the user.
  const isCheckingAuth = isLoading || (!!error && isValidating);

  return {
    authenticatedUser: data,
    isLoading: isCheckingAuth,
    error: isCheckingAuth ? undefined : error,
  };
}
