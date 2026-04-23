/** @type {import('next').NextConfig} */
const nextConfig = {
    // Required for Netlify deployment with App Router
    output: "standalone",
  
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "rzjlwngoqgptmfgbowrh.supabase.co",
          pathname: "/storage/v1/object/public/**",
        },
        {
          protocol: "https",
          hostname: "images.unsplash.com",
        },
      ],
    },
  };
  
  module.exports = nextConfig;