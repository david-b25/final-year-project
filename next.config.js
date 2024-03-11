/**
 * @type {import('next').NextConfig}
 */
module.exports = {
    experimental: {
      serverActions: {
        allowedOrigins: ["localhost:3000"],
      },
    },
    images: {
      remotePatterns: [
        { hostname: "public.blob.vercel-storage.com" },
        { hostname: "irnytkd86cragr7x.public.blob.vercel-storage.com"},
        { hostname: "res.cloudinary.com" },
        { hostname: "abs.twimg.com" },
        { hostname: "pbs.twimg.com" },
        { hostname: "avatar.vercel.sh" },
        { hostname: "avatars.githubusercontent.com" },
        { hostname: "www.google.com" },
        { hostname: "flag.vercel.app" },
        { hostname: "illustrations.popsy.co" },
      ]
    },
  };
  