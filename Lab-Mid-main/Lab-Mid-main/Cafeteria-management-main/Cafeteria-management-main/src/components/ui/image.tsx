import { forwardRef, ImgHTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE_URL =
  "https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png";

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fittingType?: "fill" | "fit";
  originWidth?: number;
  originHeight?: number;
  focalPointX?: number;
  focalPointY?: number;
};

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, className, onError, alt, fittingType = "fill", ...props }, ref) => {
    const [resolvedSrc, setResolvedSrc] = useState<string | undefined>(src);

    useEffect(() => {
      setResolvedSrc(src);
    }, [src]);

    if (!resolvedSrc) {
      return <div data-empty-image className={className} />;
    }

    return (
      <img
        ref={ref}
        src={resolvedSrc}
        alt={alt || ""}
        className={cn("max-w-full", fittingType === "fit" ? "object-contain" : "object-cover", className)}
        onError={(event) => {
          onError?.(event);
          if (resolvedSrc !== FALLBACK_IMAGE_URL) {
            setResolvedSrc(FALLBACK_IMAGE_URL);
          }
        }}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";
