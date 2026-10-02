const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const getApiBase = () =>
  siteUrl ? `${siteUrl}/api` : "http://127.0.0.1:3000/api";
