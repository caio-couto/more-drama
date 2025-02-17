import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{
      hostname: "placehold.co"
    }, {
      hostname: "68xi7mvh5ofdswpx.public.blob.vercel-storage.com"
    }]
  }
};

export default nextConfig;
