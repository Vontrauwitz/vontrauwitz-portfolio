import type { CSSProperties } from 'react';
import type { IconProps } from './types';

export const InteliJComponent = ({ className, ...rest }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{ enableBackground: "new 0 0 70 70" } as CSSProperties}
    viewBox="0 0 70 70"
    {...rest}
    preserveAspectRatio="xMidYMid"
    className={`w-full h-auto ${className}`}
  >
    <linearGradient
      id="a"
      x1={0.79}
      x2={33.317}
      y1={40.089}
      y2={40.089}
      gradientUnits="userSpaceOnUse"
    >
      <stop
        offset={0.258}
        style={{
          stopColor: "#f97a12",
        }}
      />
      <stop
        offset={0.459}
        style={{
          stopColor: "#b07b58",
        }}
      />
      <stop
        offset={0.724}
        style={{
          stopColor: "#577bae",
        }}
      />
      <stop
        offset={0.91}
        style={{
          stopColor: "#1e7ce5",
        }}
      />
      <stop
        offset={1}
        style={{
          stopColor: "#087cfa",
        }}
      />
    </linearGradient>
    <path
      d="M17.7 54.6.8 41.2l8.4-15.6L33.3 35z"
      style={{
        fill: "url(#a)",
      }}
    />
    <linearGradient
      id="b"
      x1={25.767}
      x2={79.424}
      y1={24.88}
      y2={54.57}
      gradientUnits="userSpaceOnUse"
    >
      <stop
        offset={0}
        style={{
          stopColor: "#f97a12",
        }}
      />
      <stop
        offset={0.072}
        style={{
          stopColor: "#cb7a3e",
        }}
      />
      <stop
        offset={0.154}
        style={{
          stopColor: "#9e7b6a",
        }}
      />
      <stop
        offset={0.242}
        style={{
          stopColor: "#757b91",
        }}
      />
      <stop
        offset={0.334}
        style={{
          stopColor: "#537bb1",
        }}
      />
      <stop
        offset={0.432}
        style={{
          stopColor: "#387ccc",
        }}
      />
      <stop
        offset={0.538}
        style={{
          stopColor: "#237ce0",
        }}
      />
      <stop
        offset={0.655}
        style={{
          stopColor: "#147cef",
        }}
      />
      <stop
        offset={0.792}
        style={{
          stopColor: "#0b7cf7",
        }}
      />
      <stop
        offset={1}
        style={{
          stopColor: "#087cfa",
        }}
      />
    </linearGradient>
    <path
      d="m70 18.7-1.3 40.5L41.8 70 25.6 59.6 49.3 35 38.9 12.3l9.3-11.2z"
      style={{
        fill: "url(#b)",
      }}
    />
    <linearGradient
      id="c"
      x1={63.228}
      x2={48.29}
      y1={42.915}
      y2={-1.719}
      gradientUnits="userSpaceOnUse"
    >
      <stop
        offset={0}
        style={{
          stopColor: "#fe315d",
        }}
      />
      <stop
        offset={0.078}
        style={{
          stopColor: "#cb417e",
        }}
      />
      <stop
        offset={0.16}
        style={{
          stopColor: "#9e4e9b",
        }}
      />
      <stop
        offset={0.247}
        style={{
          stopColor: "#755bb4",
        }}
      />
      <stop
        offset={0.339}
        style={{
          stopColor: "#5365ca",
        }}
      />
      <stop
        offset={0.436}
        style={{
          stopColor: "#386ddb",
        }}
      />
      <stop
        offset={0.541}
        style={{
          stopColor: "#2374e9",
        }}
      />
      <stop
        offset={0.658}
        style={{
          stopColor: "#1478f3",
        }}
      />
      <stop
        offset={0.794}
        style={{
          stopColor: "#0b7bf8",
        }}
      />
      <stop
        offset={1}
        style={{
          stopColor: "#087cfa",
        }}
      />
    </linearGradient>
    <path
      d="M70 18.7 48.7 43.9l-9.8-31.6 9.3-11.2z"
      style={{
        fill: "url(#c)",
      }}
    />
    <linearGradient
      id="d"
      x1={10.72}
      x2={55.524}
      y1={16.473}
      y2={90.58}
      gradientUnits="userSpaceOnUse"
    >
      <stop
        offset={0}
        style={{
          stopColor: "#fe315d",
        }}
      />
      <stop
        offset={0.04}
        style={{
          stopColor: "#f63462",
        }}
      />
      <stop
        offset={0.104}
        style={{
          stopColor: "#df3a71",
        }}
      />
      <stop
        offset={0.167}
        style={{
          stopColor: "#c24383",
        }}
      />
      <stop
        offset={0.291}
        style={{
          stopColor: "#ad4a91",
        }}
      />
      <stop
        offset={0.55}
        style={{
          stopColor: "#755bb4",
        }}
      />
      <stop
        offset={0.917}
        style={{
          stopColor: "#1d76ed",
        }}
      />
      <stop
        offset={1}
        style={{
          stopColor: "#087cfa",
        }}
      />
    </linearGradient>
    <path
      d="M33.7 58.1 5.6 68.3l4.5-15.8L16 33.1 0 27.7 10.1 0l22 2.7 21.6 24.7z"
      style={{
        fill: "url(#d)",
      }}
    />
    <path
      d="M13.7 13.5h43.2v43.2H13.7z"
      style={{
        fill: "#000",
      }}
    />
    <path
      d="M17.7 48.6h16.2v2.7H17.7zM29.4 22.4v-3.3h-9v3.3H23v11.3h-2.6V37h9v-3.3h-2.5V22.4zM38 37.3c-1.4 0-2.6-.3-3.5-.8-.9-.5-1.7-1.2-2.3-1.9l2.5-2.8c.5.6 1 1 1.5 1.3.5.3 1.1.5 1.7.5.7 0 1.3-.2 1.8-.7.4-.5.6-1.2.6-2.3V19.1h4v11.7c0 1.1-.1 2-.4 2.8-.3.8-.7 1.4-1.3 2-.5.5-1.2 1-2 1.2-.8.3-1.6.5-2.6.5"
      style={{
        fill: "#fff",
      }}
    />
  </svg>
);
