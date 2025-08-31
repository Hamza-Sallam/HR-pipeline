
import * as React from 'react';

export function Logo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/logo.jpg"
      alt="SmartGaters Logo"
      width="135"
      height="32"
      {...props}
    />
  );
}

    