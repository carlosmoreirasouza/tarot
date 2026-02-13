import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{
    allowedDevOrigins:[
      "http://76.13.171.33:3000",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
  },
};

export default nextConfig;
