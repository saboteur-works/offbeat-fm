import axios from "axios";

export default async function setFavoriteEditorialProfile(
  profileId: string,
  remove: boolean,
) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/editorial/${profileId}/favorite`,
      { remove },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error("Error setting favorite editorial profile:", error);
    throw error;
  }
}
