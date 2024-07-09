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

export interface ImageInfo {
  url: string;
  active: boolean;
}

export type ImageInfoMap = Record<Size, ImageInfo | null>;

async function pngBlobToImageInfoMap(imageUrl: string): Promise<ImageInfoMap> {
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

async function icoBlobToImageInfoMap(imageUrl: string): Promise<ImageInfoMap> {
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

async function imageUrlToImageInfoMap(imageUrl: string): Promise<ImageInfoMap> {
  const blob = await fetch(imageUrl).then((res) => res.blob());
  if (blob.type === "image/png") {
    return pngBlobToImageInfoMap(imageUrl);
  } else if (
    blob.type === "image/x-icon" ||
    blob.type === "image/vnd.microsoft.icon"
  ) {
    return icoBlobToImageInfoMap(imageUrl);
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

  const [dialogOpen, setDialogOpen] = useState(false); // TODO: ignore scroll when dialog is open
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
        const resizedImageUrl = await resizeImageUrl(imageInfo.url, size);
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
    }
  }, [validInputUrl, inputUrl]);

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setDialogOpen(false);
      }
    });
  }, []);

  return (
    <>
      <DropZone
        as="div"
        className="flex flex-col items-center w-full h-screen"
        allow="drop"
        onChange={loadImageUrlToAllSizes}
      >
        <div className="flex-1 flex flex-col items-center justify-center gap-10 px-10">
          <div className="flex  items-center justify-center gap-10">
            <div className="flex flex-col flex-1 h-full items-center justify-center">
              <h1 className="text-4xl font-bold text-center">
                Better ICO&rsquo;s
              </h1>
              <p className="text-xl text-center pt-1 text-balance">
                Create and View ICO&rsquo;s with Ease
              </p>
            </div>
            <div className="flex flex-col flex-1 h-full items-center justify-center gap-4">
              <DropZone
                onChange={loadImageUrlToAllSizes}
                className="flex flex-col items-center justify-center shadow-xl-center rounded-2xl px-14 pt-10 pb-7 gap-5 bg-white"
                allow="drop"
                as="div"
              >
                <p className="font-semibold text-xl">Quick Create</p>
                <DropZone
                  as={MagneticButton}
                  onChange={loadImageUrlToAllSizes}
                  className="cursor-pointer bg-blue-500 text-white hover:scale-105 active:scale-95 rounded-full transition-all duration-200 shadow-lg flex items-center gap-2 px-4 py-2"
                  allow="click"
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
                    onClick={() => setDialogOpen(true)}
                    tabIndex={dialogOpen ? -1 : 0}
                  >
                    from a URL
                  </button>
                </p>
              </DropZone>
            </div>
          </div>
          <SizedDropZones
            imageInfos={imageInfos}
            updateImageInfo={updateImageInfo}
            tabIndex={dialogOpen ? -1 : 0}
          />

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
          "fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center backdrop-blur-[2px] transition-all",
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
          <p className="text-xl font-bold">Enter a URL to load an image</p>

          <input
            tabIndex={dialogOpen ? 0 : -1}
            onChange={updateInputUrl}
            type="url"
            className="w-full rounded-xl border-2 border-gray-300 px-4 py-2 text-lg"
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
