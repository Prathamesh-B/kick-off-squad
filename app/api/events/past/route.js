import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    const session = await auth()
    
    try {
        const today = new Date().toISOString();

        const pastEvents = await prisma.event.findMany({
            where: {
                dateTime: {
                    lt: today,
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
                    },
                },
                result: true,
            },
            orderBy: {
                dateTime: 'desc',
            },
        });

        return new Response(JSON.stringify(pastEvents), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'CDN-Cache-Control': 'no-store',
                'Vercel-CDN-Cache-Control': 'no-store'
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Error fetching past events' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'CDN-Cache-Control': 'no-store',
                'Vercel-CDN-Cache-Control': 'no-store'
            },
        });
    }
}
