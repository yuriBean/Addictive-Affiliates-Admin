import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export const uploadMediaFiles = (files, path = "media/") => {
  return new Promise((resolve, reject) => {
    if (!files || files.length === 0) {
      return reject("No files provided");
    }

    const uploadPromises = [];

    files.forEach((file) => {
      if (file.size > 150 * 1024 * 1024) {
        return reject(`File ${file.name} exceeds the 150MB limit.`);
      }

      const storageRef = ref(storage, `${path}${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadPromises.push(
        new Promise((resolveUpload, rejectUpload) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              console.log(`Upload ${file.name} is ${progress}% done`);
            },
            (error) => {
              console.error(`Upload failed for ${file.name}:`, error);
              rejectUpload(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolveUpload({ fileName: file.name, url: downloadURL });
              } catch (error) {
                console.error("Failed to get download URL:", error);
                rejectUpload(error);
              }
            }
          );
        })
      );
    });

    Promise.all(uploadPromises)
      .then((urls) => resolve(urls))
      .catch((error) => reject(error));
  });
};