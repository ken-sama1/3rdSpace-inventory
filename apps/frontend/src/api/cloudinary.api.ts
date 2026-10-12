import { api } from "./api";

const cldName = import.meta.env.VITE_CLD_NAME as string;
const cldPreset = import.meta.env.VITE_CLD_PRESET as string;
const baseUrl = `https://api.cloudinary.com/v1_1/${cldName}/image/upload`;

const upload = async (file: string): Promise<string> => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", cldPreset);

  const { data } = await api.post<unknown>(baseUrl, formData);

  if (
    typeof data === "object" &&
    data &&
    "source_url" in data &&
    typeof data.source_url === "string"
  )
    return data.source_url;

  return "";
};

export const cloudinaryApi = {
  upload,
};
