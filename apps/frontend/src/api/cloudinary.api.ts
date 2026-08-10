import { api } from "./api";

const cldName = import.meta.env.VITE_CLD_NAME;
const cldPreset = import.meta.env.VITE_CLD_PRESET;
const baseUrl = `https://api.cloudinary.com/v1_1/${cldName}/image/upload`;

const upload = async (file: string): Promise<string> => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", cldPreset);

  const { data } = await api.post(baseUrl, formData);

  return data.secure_url;
};

export const cloudinaryApi = {
  upload,
};
