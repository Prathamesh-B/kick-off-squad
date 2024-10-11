import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(req) {
    const session = await auth()

    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '2')
        const skip = (page - 1) * limit

        const today = new Date();

        const [upcomingEvents, totalCount] = await Promise.all([
            prisma.event.findMany({
                where: {
                    dateTime: {
                        gte: today,
                    },
                },
                include: {
                    registrations: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true,
                                },
                            },
                        },
                    },
                    creator: {
                        select: {
                            name: true,
                            email: true,
                            image: true,
                            upiId: true,
                        },
                    },
                },
                orderBy: {
                    dateTime: 'asc',
                },
                skip,
                take: limit,
            }),
            prisma.event.count({
                where: {
                    dateTime: {
                        gte: today,
                    },
                },
            })
        ]);

        return new Response(JSON.stringify({
            events: upcomingEvents,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            totalCount
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'CDN-Cache-Control': 'no-store',
                'Vercel-CDN-Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Error fetching upcoming events' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'CDN-Cache-Control': 'no-store',
                'Vercel-CDN-Cache-Control': 'no-store',
            },
        });
    }
}