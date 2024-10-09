import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = await prisma.event.findMany({
            where: {
                date: {
                    gte: today,
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
        });

        return new Response(JSON.stringify(upcomingEvents), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching upcoming events' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}