
import * as React from 'react';

export function Logo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/Artboard-440.png.webp"
      alt="180Degree Logo"
      width="135"
      height="32"
      {...props}
    />
  );
}

    