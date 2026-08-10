import { Cloudinary } from "@cloudinary/url-gen";

const useCloudinary = () => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.CLOUDINARY_NAME,
      apiKey: import.meta.env.CLOUDINARY_KEY,
      apiSecret: import.meta.env.CLOUDINARY_SECRET,
    },
  });

  const someShi = cld.image("");
  return <div></div>;
};

export default useCloudinary;
