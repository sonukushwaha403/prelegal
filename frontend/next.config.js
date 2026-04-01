/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  transpilePackages: ['react-markdown', 'remark-gfm', 'rehype-raw'],
}

module.exports = nextConfig
