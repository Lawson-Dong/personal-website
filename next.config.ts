import type { NextConfig } from 'next';

const projectsPath = '/machine-learning-deep-learning-projects';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/machine-learning-cognitive-science', destination: projectsPath, permanent: true },
      { source: '/coding/pytorch-experience', destination: `${projectsPath}#pytorch-course`, permanent: true },
      { source: '/coding/kaggle', destination: `${projectsPath}#kaggle`, permanent: true },
    ];
  },
};

export default nextConfig;
