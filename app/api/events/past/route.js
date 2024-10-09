import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const pastEvents = await prisma.event.findMany({
            where: {
                date: {
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
                date: 'desc',
            },
        });

        return new Response(JSON.stringify(pastEvents), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching past events' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
