import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	env: {
		X_API_KEY: process.env.X_API_KEY,
		JWT_SECRET: process.env.JWT_SECRET,
		SERVER_API: process.env.SERVER_API,
		API_URL: process.env.API_URL,
	},
};

export default nextConfig;
