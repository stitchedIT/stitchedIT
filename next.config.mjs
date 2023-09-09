/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  images: {
    domains: [
      "imagesitems.blob.core.windows.net",
      "xwhmshfqmtdtneasprwx.supabase.co",
      "img.clerk.com",
      "lh3.googleusercontent.com",
      "cdn.discordapp.com",
    ],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default config;
