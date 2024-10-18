/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboard_admin',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
