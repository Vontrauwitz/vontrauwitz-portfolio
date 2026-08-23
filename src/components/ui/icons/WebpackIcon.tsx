import type { IconProps } from './types';

export const WebpackIcon = ({ className, ...rest }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 110.8 122.88"
    className={` w-10 h-10 ${className}`}
    {...rest}
  >
    <title>{"webpack"}</title>
    <path
      d="m107.39 94.71-49.8 28.17v-21.94l31-17.07 18.8 10.83Zm3.41-3.09V32.71L92.58 43.24v37.87l18.22 10.51ZM3.41 94.71l49.8 28.17v-21.94l-31-17.07-18.8 10.84ZM0 91.62V32.71l18.22 10.53v37.87L0 91.62Zm2.14-62.73L53.21 0v21.2l-32.73 18-.26.14L2.14 28.89Zm106.52 0L57.59 0v21.2l32.73 18 .26.15 18.08-10.45Z"
      style={{
        fill: "#8ed6fb",
      }}
    />
    <path
      d="M53.21 96 22.59 79.1V45.75l30.62 17.68V96Zm4.38 0 30.62-16.88V45.75L57.59 63.43V96ZM24.66 42 55.4 25l30.74 16.9L55.4 59.64 24.66 41.9Z"
      style={{
        fill: "#1c78c0",
      }}
    />
  </svg>
);
