import axiosInstance from "../util/axiosInstance";

export default async function getRandomArtists(exclude?: string) {
  try {
    const response = await axiosInstance.get("/artists/random", {
      params: { exclude, includeArt: true },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching random artists:", error);
  }
}
