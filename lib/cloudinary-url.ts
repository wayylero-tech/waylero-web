const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dewd42ppf/image/upload";

export function getCloudinaryUrl(
  imagePath: string,
  width: number = 1200
) {
  if (!imagePath) return "";

  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${imagePath.replace(/^\/+/, "")}`;
}