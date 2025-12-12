import ImageBlobReduce from "image-blob-reduce";
import Pica from "pica";

const pica = Pica({ features: ["js", "wasm", "cib"] });
const reduce = new ImageBlobReduce({ pica });

const resizeImage = async (imgBlob: File) => {
  const newBlob = await reduce.toCanvas(imgBlob, { max: 1024 });
  return new Promise<Blob | null>((resolve, reject) => {
    newBlob.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], imgBlob.name, { type: imgBlob.type }));
      } else {
        reject(new Error("Failed to convert canvas to blob"));
      }
    });
  });
};

export default resizeImage;
