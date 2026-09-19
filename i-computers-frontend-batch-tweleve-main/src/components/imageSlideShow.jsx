import React, { useEffect, useState } from "react";

import { getImageUrl } from "../lib/imageUrl";

export default function ImageSlideShow({
  images = [],
}) {
  const validImages = Array.isArray(images)
    ? images.filter(Boolean)
    : [];

  const [activeIndex, setActiveIndex] =
    useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  if (validImages.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-2xl bg-gray-100">
        <span className="text-sm text-gray-400">
          No image available
        </span>
      </div>
    );
  }

  const currentImage =
    validImages[activeIndex];

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0
        ? validImages.length - 1
        : current - 1
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === validImages.length - 1
        ? 0
        : current + 1
    );
  };

  return (
    <div className="w-full">
      {/* Main image */}
      <div className="relative flex h-[400px] items-center justify-center overflow-hidden rounded-2xl bg-gray-50 p-6">
        <img
          src={getImageUrl(currentImage)}
          alt={`Product ${activeIndex + 1}`}
          className="max-h-full max-w-full object-contain"
          onError={(event) => {
            event.currentTarget.src =
              "https://via.placeholder.com/600x500?text=No+Image";
          }}
        />

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousImage}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl text-white hover:bg-black/70"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl text-white hover:bg-black/70"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {validImages.map(
            (image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() =>
                  setActiveIndex(index)
                }
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-50 p-1 ${
                  activeIndex === index
                    ? "border-blue-600"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}