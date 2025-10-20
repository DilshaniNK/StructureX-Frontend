import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const ImageCarousel = ({ images = [], title = "Image", id }) => {
  const [imageIndex, setImageIndex] = useState(0);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (!images || images.length === 0) {
    return (
      <div className="h-64 overflow-hidden border-1 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <div className="text-5xl mb-2">📷</div>
          <p className="text-slate-600 font-semibold">No Image Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group h-64 overflow-hidden bg-slate-100 rounded-lg">
      <img
        src={images[imageIndex]}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
          </button>

          <button
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronDown className="w-5 h-5 -rotate-90" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {imageIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
