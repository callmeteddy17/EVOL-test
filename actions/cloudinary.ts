import axios from 'axios';

type Props = {
  formData: FormData;
  fileType: string;
};

export const uploadFile = async ({ formData, fileType }: Props) => {
  const file = formData.get('file') as File;
  formData.append(
    'upload_preset',
    `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
  );
  if (!file) {
    throw new Error('File is not found');
  }
  const contentType = fileType;
  let cloudinaryUrl = '';
  contentType
    ? contentType.startsWith('image')
      ? (cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`)
      : contentType.startsWith('video')
      ? (cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`)
      : () => {
          throw new Error('Unsupported file type');
        }
    : () => {
        throw new Error("Can not find file's content type");
      };

  try {
    const response = await axios.post(cloudinaryUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  } catch (error) {
    throw error;
  }
};
