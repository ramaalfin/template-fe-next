/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,

  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboard-admin',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
