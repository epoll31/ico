import { removeBackground } from "@imgly/background-removal";

export async function removeBG(imageUrl: string) {
  console.log("removeBG", imageUrl);
  return removeBackground(imageUrl, {
    debug: true,
  }).then((blob: Blob) => {
    // The result is a blob encoded as PNG. It can be converted to an URL to be used as HTMLImage.src
    const url = URL.createObjectURL(blob);
    console.log("removeBG url", url);
    return url;
  });
}
