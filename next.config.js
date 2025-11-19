import { withBotId } from 'botid/next/config';

const nextConfig = {
  experimental: {
    allowedDevOrigins: ["http://192.168.12.188:3000"],
  },
  async redirects() {
    return [{ source: '/', destination: '/home', permanent: false }];
  },
};

export default withBotId(nextConfig);
