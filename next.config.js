/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}



module.exports = {
  pageExtensions: ['jsx', 'js'], // 이 옵션을 추가하여 JS 파일도 페이지로 인식하도록 설정

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.0.98:4000/api/:path*',
      }
    ];
  },

  // 기본적인  PWA 설정   //나중에 true 로 바꿔야함
  pwa: { 
    dest: 'public',
    register: false,
    skipWaiting: true,
  },
};
