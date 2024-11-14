/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true, // Add trailing slashes to URLs
  output: 'export', // Tell Next.js to export as static files  
  distDir: 'out', // Change the output directory to 'out' (required for static export)
  images: {
    unoptimized: true, // Disable Next.js image optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
      {
        protocol: "https",
        hostname: "people.pic1.co",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "app-uploads-cdn.fera.ai",
      },
    ],
  },
  // Ensure build output goes to 'out' directory

};

export default nextConfig;