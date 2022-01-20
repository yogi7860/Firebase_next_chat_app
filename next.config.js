require("dotenv").config({
  path: `environments/.env.${process.env.NODE_ENV || "dev"}`
})

module.exports = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  reactStrictMode: true,
  env: process.env.NODE_ENV
}
