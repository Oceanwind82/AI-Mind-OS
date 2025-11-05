import { withBotId } from 'botid/next/config';

const nextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/home', permanent: false }];
  },
};

export default withBotId(nextConfig);
