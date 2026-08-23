import type { CSSProperties } from 'react';
import type { IconProps } from './types';

export const SpringBootIcon = ({ className, ...rest }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{ enableBackground: "new 0 0 117.92 122.88" } as CSSProperties}
    viewBox="0 0 117.92 122.88"
    className={`w-10 h-10 ${className}`}
    {...rest}
  >
    <path
      d="M13.54 97.85c-5.05 6.71-9.37 12.31-11.71 18.72-2.29 6.25-3.22 9.12 1.97 2.62 4.84-6.04 9.37-11.92 15.97-17.47.46.12.97.21 1.48.32C81.12 113.94 124.7 87.02 117.04 0 70.96 15.97 5.68 9.47 12.43 91.26c.26 3.03.49 5.11 1.11 6.59zM27.72 86.1c15.65-33.71 55.85-45.26 75.79-68.3-21.6 42.12-39.28 44.19-75.79 68.3z"
      style={{
        fill: "#89bf3f",
      }}
    />
    <path
      d="M27.72 86.1c15.65-33.71 55.85-45.26 75.79-68.3-21.6 42.12-39.28 44.19-75.79 68.3z"
      style={{
        fill: "#4ca71e",
      }}
    />
  </svg>
);
