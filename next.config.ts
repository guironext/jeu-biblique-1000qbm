import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  // Mark optional email providers as external to avoid build errors when not installed
  serverExternalPackages: ["nodemailer", "resend", "@sendgrid/mail"],
};

export default nextConfig;
