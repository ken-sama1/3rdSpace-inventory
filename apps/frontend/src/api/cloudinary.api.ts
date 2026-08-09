import { api } from "./api";

const cldName = import.meta.env.VITE_CLD_NAME;
const cldPreset = import.meta.env.VITE_CLD_PRESET;
const baseUrl = `https://api.cloudinary.com/v1_1/${cldName}/image/upload`;

export const upload = async (file: string) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", cldPreset);

  const { data } = await api.post(baseUrl, formData);
  return data;
};

export const cloudinaryApi = {
  upload,
};
