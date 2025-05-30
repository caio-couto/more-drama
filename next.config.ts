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
    }, {
      hostname: "more-drama.s3.us-east-1.amazonaws.com"
    }, {
      hostname: "d310rh8f423q4b.cloudfront.net"
    }]
  },
  env: {

  }
};

export default nextConfig;
