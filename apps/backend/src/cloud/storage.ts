import { ApiError, Storage } from "@google-cloud/storage";
import {
  createImageUploadedEvent,
  logServerEvent,
} from "../serverEvents/serverEvents";
let storage: Storage;
const imgBucketName = "offbeat-fm.com";
if (process.env.NODE_ENV === "production") {
  storage = new Storage();
} else {
  storage = new Storage({
    apiEndpoint: process.env.LOCAL_TEST
      ? "http://localhost:5555"
      : "http://fake-gcs-server:8080",
    projectId: "offbeat-test",
  });
  storage.getBuckets().then((buckets) => {
    if (!buckets[0].find((bucket) => bucket.name === imgBucketName)) {
      storage.createBucket(imgBucketName).catch((err) => {
        console.error("Error creating bucket in local storage emulator:", err);
      });
    } else {
      console.log(
        `Bucket ${imgBucketName} already exists in local storage emulator.`,
      );
    }
  });
}

async function getImageContents(filePath: string) {
  try {
    const file = storage.bucket(imgBucketName).file(filePath);
    const [contents] = await file.download();
    return contents;
  } catch (error: unknown) {
    let errString =
      "An error occurred while getting image contents from storage. ";
    if (error instanceof ApiError && error.code === 404) {
      errString += `File '${filePath}' not found.`;
      console.warn(errString);
      return null;
    }
    // throw error;
  }
}

async function upload(
  user: string,
  destFileName: string,
  contents: Express.Multer.File,
) {
  try {
    const { buffer, mimetype } = contents;
    await storage
      .bucket(imgBucketName)
      .file(destFileName)
      .save(buffer, { contentType: mimetype });

    console.log(`${destFileName} uploaded to ${imgBucketName}.`);
    logServerEvent(createImageUploadedEvent(destFileName, user));
    return destFileName;
  } catch (error) {
    console.error("Error uploading file to storage:", error);
    throw error;
  }
}

async function deleteFile(filePath: string) {
  try {
    await storage.bucket(imgBucketName).file(filePath).delete();
    console.log(`File ${filePath} deleted from bucket ${imgBucketName}.`);
  } catch (error) {
    console.error("Error deleting file from storage:", error);
    throw error;
  }
}

async function deleteFolder(folderPath: string) {
  try {
    const bucket = storage.bucket(imgBucketName);
    const [files] = await bucket.getFiles({ prefix: folderPath });
    const deletePromises = files.map((file) => file.delete());
    await Promise.all(deletePromises);
    console.log(`Folder ${folderPath} and its contents deleted.`);
  } catch (error) {
    console.error("Error deleting folder from storage:", error);
    throw error;
  }
}

async function emptyBucket() {
  try {
    const bucket = storage.bucket(imgBucketName);
    const [files] = await bucket.getFiles();
    const deletePromises = files.map((file) => file.delete());
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error emptying bucket:", error);
    throw error;
  }
}
export { upload, getImageContents, deleteFile, emptyBucket, deleteFolder };
export default storage;
