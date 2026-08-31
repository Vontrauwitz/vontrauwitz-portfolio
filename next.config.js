/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Checkpoint 5.1 — admin-uploaded project images live at Cloudinary
    // secure_urls now (src/lib/cloudinary/uploadImage.ts), alongside the
    // existing root-relative /public paths for projects not yet
    // re-uploaded. next/image requires every external domain it's asked
    // to render explicitly allow-listed; scoped to this account's own
    // Cloudinary delivery host only, not a wildcard.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
