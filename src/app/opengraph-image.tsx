import { ImageResponse } from 'next/og';

// Default OG image, used as the fallback for any route that doesn't define
// its own. Colors match the Part V Preservation Contract palette exactly
// (dark #1b1b1b, light #f5f5f5, primary #B63E96); text is the same site
// name/title already used across every page's metadata — nothing invented.
export const alt = 'VontrauwitzDEV | Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1b1b1b',
          color: '#f5f5f5',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 700, color: '#B63E96' }}>
          VontrauwitzDEV
        </div>
        <div style={{ fontSize: 36, marginTop: 24 }}>
          Full-Stack Developer Portfolio
        </div>
      </div>
    ),
    { ...size }
  );
}
