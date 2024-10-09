import prisma from '@/lib/prisma';

export async function GET() {
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
            },
            orderBy: {
                dateTime: 'desc',
            },
        });

        return new Response(JSON.stringify(pastEvents), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Error fetching past events' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
