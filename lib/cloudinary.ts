export function makeCroppedCloudinaryUrl(originalUrl: string, crop: { x: number; y: number; width: number; height: number }) {
  // inserts `c_crop,w_,h_,x_,y_` right after `/upload/`
  const marker = "/upload/";
  const idx = originalUrl.indexOf(marker);
  if (idx === -1) return originalUrl;

  const transform = `c_crop,w_${Math.round(crop.width)},h_${Math.round(crop.height)},x_${Math.round(crop.x)},y_${Math.round(crop.y)}`;

  return originalUrl.slice(0, idx + marker.length) + transform + "/" + originalUrl.slice(idx + marker.length);
}