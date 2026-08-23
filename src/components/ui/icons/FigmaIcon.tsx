import type { CSSProperties } from 'react';
import type { IconProps } from './types';

export const FigmaIcon = ({ className, ...rest }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{ enableBackground: "new 0 0 81.92 122.88" } as CSSProperties}
    viewBox="0 0 81.92 122.88"
    className={`w-10 h-10 ${className}`}
    {...rest}
  >
    <path
      d="M20.48 122.88c11.3 0 20.48-9.17 20.48-20.48V81.92H20.48C9.18 81.92 0 91.09 0 102.4s9.18 20.48 20.48 20.48z"
      style={{
        fill: "#0acf83",
      }}
    />
    <path
      d="M0 61.44c0-11.3 9.18-20.48 20.48-20.48h20.48v40.96H20.48C9.18 81.92 0 72.75 0 61.44z"
      style={{
        fill: "#a259ff",
      }}
    />
    <path
      d="M0 20.48C0 9.18 9.18 0 20.48 0h20.48v40.96H20.48C9.18 40.96 0 31.79 0 20.48z"
      style={{
        fill: "#f24e1e",
      }}
    />
    <path
      d="M40.96 0h20.48c11.3 0 20.48 9.18 20.48 20.48 0 11.31-9.17 20.48-20.48 20.48H40.96V0z"
      style={{
        fill: "#ff7262",
      }}
    />
    <path
      d="M81.92 61.44c0 11.31-9.17 20.48-20.48 20.48s-20.48-9.17-20.48-20.48c0-11.3 9.17-20.48 20.48-20.48s20.48 9.18 20.48 20.48z"
      style={{
        fill: "#1abcfe",
      }}
    />
  </svg>
);
