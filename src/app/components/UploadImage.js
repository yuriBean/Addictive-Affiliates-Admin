import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; 

export const uploadImage = (image, path = 'images/') => {
  return new Promise((resolve, reject) => {
    if (!image) {
      return reject('No image file provided');
    }

    const storageRef = ref(storage, `${path}${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error('Upload failed:', error);
        reject(error); 
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL); 
        } catch (error) {
          console.error('Failed to get download URL:', error);
          reject(error);
        }
      }
    );
  });
};
