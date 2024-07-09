"use client";

import DropZone from "@/components/DropZone";
import SizedDropZones from "@/components/SizedDropZones";
import Upload from "@/components/icons/upload";
import { useCallback, useEffect, useMemo, useState } from "react";
import { icoToImageUrls } from "@/utils/decodeImage";
import { Size, Sizes } from "@/lib/types";
import downloadBlobAsFile from "@/utils/downloadBlobAsFile";
import { resizeImageUrl, resizeImageUrls } from "@/utils/resizeImageUrls";
import spreadSizes from "@/utils/spreadSizes";
import cn from "@/utils/cn";
import Footer from "@/components/Footer";
import Download from "@/components/icons/download";
import MagneticButton from "@/components/MagneticButton";
import Check from "@/components/icons/check";
import X from "@/components/icons/x";
import { webpToPng } from "@/utils/webpToPng";
import { svgToPng } from "@/utils/svgToPng";

export interface ImageInfo {
  url: string;
  active: boolean;
}

export type ImageInfoMap = Record<Size, ImageInfo | null>;

const InputFileMimeTypes =
  "image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon";
const InputFileExtensions = "png,jpg,jpeg,webp,svg,ico";
const InputFileTypes = `${InputFileMimeTypes},${InputFileExtensions}`;

async function spreadImageUrlToImageInfoMap(
  imageUrl: string
): Promise<ImageInfoMap> {
  const spreadImageUrls = spreadSizes(imageUrl);

  const resizedImageUrls = await resizeImageUrls(spreadImageUrls);

  return Sizes.reduce<ImageInfoMap>(
    (imageInfos, size) => ({
      ...imageInfos,
      [size]: {
        url: resizedImageUrls[size],
        active: true,
        removeBGUrl: null,
      },
    }),
    spreadSizes<ImageInfo | null>(null)
  );
}

async function spreatICOImageUrlToImageInfoMap(
  imageUrl: string
): Promise<ImageInfoMap> {
  const imageUrlsFromIco = await icoToImageUrls(imageUrl);

  const imageUrlsFromIcoOrNull = {
    ...spreadSizes(null),
    ...imageUrlsFromIco,
  };

  return Sizes.reduce<ImageInfoMap>((imageInfos, size) => {
    const imageUrl = imageUrlsFromIcoOrNull[size];
    if (imageUrl) {
      return {
        ...imageInfos,
        [size]: {
          url: imageUrl,
          active: true,
          removeBGUrl: null,
        },
      };
    } else {
      return imageInfos;
    }
  }, spreadSizes<ImageInfo | null>(null));
}

async function spreadWEBPImageUrlToImageInfoMap(
  imageUrl: string
): Promise<ImageInfoMap> {
  const pngImageUrl = await webpToPng(imageUrl);
  return spreadImageUrlToImageInfoMap(pngImageUrl);
}

async function spreadSVGImageUrlToImageInfoMap(
  imageUrl: string
): Promise<ImageInfoMap> {
  const pngImageUrl = await svgToPng(imageUrl, 256);
  return spreadImageUrlToImageInfoMap(pngImageUrl);
}

async function imageUrlToImageInfoMap(imageUrl: string): Promise<ImageInfoMap> {
  //TODO: add support for TIFF // technically works with image-js but something is wrong with the result
  //TODO: add support for AVIF
  //TODO: add support for HEIC
  //TODO: add support for HEIF
  //TODO: add support for BMP

  const blob = await fetch(imageUrl).then((res) => res.blob());

  if (
    blob.type === "image/png" ||
    blob.type === "image/jpeg" ||
    blob.type === "image/jpg"
  ) {
    return spreadImageUrlToImageInfoMap(imageUrl);
  } else if (
    blob.type === "image/x-icon" ||
    blob.type === "image/vnd.microsoft.icon"
  ) {
    return spreatICOImageUrlToImageInfoMap(imageUrl);
  } else if (blob.type === "image/webp") {
    return spreadWEBPImageUrlToImageInfoMap(imageUrl);
  } else if (blob.type === "image/svg+xml") {
    return spreadSVGImageUrlToImageInfoMap(imageUrl);
  } else {
    throw new Error("Unsupported file type");
  }
}

async function fixImageUrl(imageUrl: string, size: Size): Promise<string> {
  // convert to png/jpeg/jpg from webp/svg/ico
  const blob = await fetch(imageUrl).then((res) => res.blob());

  if (
    blob.type === "image/png" ||
    blob.type === "image/jpeg" ||
    blob.type === "image/jpg"
  ) {
    return imageUrl;
  } else if (
    blob.type === "image/x-icon" ||
    blob.type === "image/vnd.microsoft.icon"
  ) {
    const imageUrlsFromIco = await icoToImageUrls(imageUrl);

    const fixedImageUrl = imageUrlsFromIco[size];

    if (fixedImageUrl) {
      return fixedImageUrl;
    } else {
      const size = Sizes.toReversed().find((size) =>
        imageUrlsFromIco[size] === null ? false : true
      );

      if (size && imageUrlsFromIco[size]) {
        return imageUrlsFromIco[size];
      } else {
        throw new Error("Could not find a valid image url in ICO");
      }
    }
  } else if (blob.type === "image/webp") {
    return await webpToPng(imageUrl);
  } else if (blob.type === "image/svg+xml") {
    return await svgToPng(imageUrl, size);
  } else {
    throw new Error("Unsupported file type");
  }
}

async function downloadImageInfoMap(imageInfos: ImageInfoMap) {
  const blobs = await Promise.all(
    Object.values(imageInfos).reduce<Promise<Blob>[]>(
      (blobs, imageInfo) =>
        imageInfo && imageInfo.active
          ? [...blobs, fetch(imageInfo.url).then((res) => res.blob())]
          : blobs,
      []
    )
  );

  const formData = new FormData();
  blobs.forEach((blob) => formData.append("blobs", blob));

  try {
    const response = await fetch("/api/convert/files", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("HTTP error: status code " + response.status);
    }

    const blob = await response.blob();

    downloadBlobAsFile(blob, "icon.ico");
  } catch (error) {
    console.error("Error:", error);
  }
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

export default function Page() {
  const [imageInfos, setImageInfos] = useState<ImageInfoMap>(
    spreadSizes<ImageInfo | null>(null)
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");

  const loadImageUrlToAllSizes = useCallback(
    async (imageUrl: string) => {
      const imageInfos = await imageUrlToImageInfoMap(imageUrl);
      setImageInfos(imageInfos);
    },
    [setImageInfos]
  );

  const updateImageInfo = useCallback(
    async (size: Size, imageInfo: ImageInfo | null) => {
      if (imageInfo) {
        const fixedImageUrl = await fixImageUrl(imageInfo.url, size);
        const resizedImageUrl = await resizeImageUrl(fixedImageUrl, size);
        setImageInfos((imageInfos) => ({
          ...imageInfos,
          [size]: {
            ...imageInfo,
            url: resizedImageUrl,
          },
        }));
      } else {
        setImageInfos((imageInfos) => ({
          ...imageInfos,
          [size]: null,
        }));
      }
    },
    [setImageInfos]
  );

  const handleDownloadRequest = useCallback(async () => {
    downloadImageInfoMap(imageInfos);
  }, [imageInfos]);

  const isDownloadDisabled = useMemo(
    () =>
      !Object.values(imageInfos).some(
        (imageInfo) => imageInfo !== null && imageInfo.active
      ),
    [imageInfos]
  );

  const updateInputUrl = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputUrl(event.target.value);
    },
    []
  );

  const validInputUrl = useMemo(() => isValidUrl(inputUrl), [inputUrl]);
  const handleUrlInputSubmit = useCallback(() => {
    if (validInputUrl) {
      loadImageUrlToAllSizes(inputUrl);
      setInputUrl("");
      setDialogOpen(false);
    }
  }, [validInputUrl, inputUrl, loadImageUrlToAllSizes]);

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setDialogOpen(false);
        setInputUrl("");
      }
    });
  }, []);

  useEffect(() => {
    if (dialogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [dialogOpen]);

  const toggleDialog = useCallback(() => {
    setDialogOpen((dialogOpen) => !dialogOpen);
    setInputUrl("");
  }, [setDialogOpen]);

  return (
    <>
      <DropZone
        as="div"
        className="flex flex-col items-center w-full h-screen pt-10"
        allow="drop"
        accept={InputFileTypes}
        onChange={loadImageUrlToAllSizes}
      >
        <div className="flex-1 flex flex-col items-center justify-center gap-10 px-10">
          <div className="gap-4 grid grid-cols-2  min-[750px]:grid-cols-5">
            <Header />
            <QuickCreate
              toggleDialog={toggleDialog}
              dialogOpen={dialogOpen}
              loadImageUrlToAllSizes={loadImageUrlToAllSizes}
            />
            <SizedDropZones
              imageInfos={imageInfos}
              updateImageInfo={updateImageInfo}
              tabIndex={dialogOpen ? -1 : 0}
              accept={InputFileTypes}
            />
          </div>

          <div className="flex items-center justify-center gap-5">
            <MagneticButton
              onClick={handleDownloadRequest}
              disabled={isDownloadDisabled}
              className={cn(
                " text-white px-4 py-2 rounded-full transition-all duration-200 shadow-lg flex items-center gap-2 ",
                isDownloadDisabled
                  ? "cursor-not-allowed bg-gray-300 text-gray-600"
                  : "cursor-pointer bg-blue-500 text-white hover:scale-105 active:scale-95"
              )}
              tabIndex={dialogOpen ? -1 : 0}
            >
              <Download className="w-4 h-4" />
              Download
            </MagneticButton>
          </div>
        </div>
        <Footer tabIndex={dialogOpen ? -1 : 0} />
      </DropZone>

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center backdrop-blur-[2px] transition-all m-10",
          dialogOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => {
          setInputUrl("");
          setDialogOpen(false);
        }}
      >
        <div
          className="flex flex-col items-center justify-center shadow-xl-center rounded-2xl px-14 pt-10 pb-10 gap-5 bg-white "
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-xl font-bold text-balance text-center">
            Enter a URL to load an image
          </p>

          <input
            tabIndex={dialogOpen ? 0 : -1}
            onChange={updateInputUrl}
            type="url"
            className="w-full rounded-xl border-2 border-gray-300 px-4 py-2 text-lg"
            value={inputUrl}
          />

          <div className="flex items-center justify-center gap-5">
            <MagneticButton
              tabIndex={dialogOpen ? 0 : -1}
              onClick={() => {
                setInputUrl("");
                setDialogOpen(false);
              }}
              className="bg-blue-500 flex items-center gap-2 px-4 py-2 rounded-full text-white transition-all duration-200 shadow-lg"
            >
              <X className="w-4 h-4" />
              Close
            </MagneticButton>

            <MagneticButton
              tabIndex={dialogOpen ? 0 : -1}
              disabled={!validInputUrl}
              onClick={handleUrlInputSubmit}
              className={cn(
                "  flex items-center gap-2 px-4 py-2 rounded-full text-white transition-all duration-200 shadow-lg",
                validInputUrl
                  ? "cursor-pointer bg-blue-500 text-white hover:scale-105 active:scale-95"
                  : "cursor-not-allowed bg-gray-300 text-gray-600"
              )}
            >
              <Check className="w-4 h-4" />
              Submit
            </MagneticButton>
          </div>
        </div>
      </div>
    </>
  );
}

function Header() {
  return (
    <div className="flex flex-col items-center justify-center col-span-2 min-[750px]:col-span-3">
      <h1 className="text-4xl font-bold text-center">Better ICO&rsquo;s</h1>
      <p className="text-xl text-center pt-1 text-balance">
        Create and View ICO&rsquo;s with Ease
      </p>
    </div>
  );
}

function QuickCreate({
  toggleDialog,
  dialogOpen,
  loadImageUrlToAllSizes,
}: {
  toggleDialog: () => void;
  dialogOpen: boolean;
  loadImageUrlToAllSizes: (imageUrl: string) => void;
}) {
  return (
    <DropZone
      onChange={loadImageUrlToAllSizes}
      className="col-span-2 flex flex-col items-center justify-center shadow-xl-center rounded-2xl px-14 pt-10 pb-7 gap-5 bg-white"
      allow="drop"
      accept={InputFileTypes}
      as="div"
    >
      <p className="font-semibold text-xl">Quick Create</p>
      <DropZone
        as={MagneticButton}
        onChange={loadImageUrlToAllSizes}
        className="cursor-pointer bg-blue-500 text-white hover:scale-105 active:scale-95 rounded-full transition-all duration-200 shadow-lg flex items-center gap-2 px-4 py-2"
        allow="click"
        accept={InputFileTypes}
        tabIndex={dialogOpen ? -1 : 0}
      >
        <Upload className="w-4 h-4" />
        <p className="whitespace-nowrap">Upload Image</p>
      </DropZone>

      <p className="text-gray-500">drop an image here</p>
      <p className="text-gray-500 -mt-4 text-xs">
        or{" "}
        <button
          className=" underline"
          onClick={toggleDialog}
          tabIndex={dialogOpen ? -1 : 0}
        >
          from a URL
        </button>
      </p>
    </DropZone>
  );
}
