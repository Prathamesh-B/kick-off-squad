/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '**',
            },
        ],
    },
    async headers() {
        return [
            {
                // Matching all API routes
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, max-age=0, must-revalidate',
                    },
                    {
                        key: 'CDN-Cache-Control',
                        value: 'no-store',
                    },
                    {
                        key: 'Vercel-CDN-Cache-Control',
                        value: 'no-store',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
