import prisma from '@/lib/prisma'; // Adjust the import path if necessary

export async function GET() {
    try {
        const upcomingEvents = await prisma.event.findMany({
            where: {
                date: {
                    gte: new Date(), // Fetch only upcoming events
                },
            },
            include: {
                registrations: true, // Include registrations
                creator: true, // Include the creator
            },
            orderBy: {
                date: 'asc', // Order by date
            },
        });

        const pastEvents = await prisma.event.findMany({
            where: {
                date: {
                    lt: new Date(), // Fetch only past events
                },
            },
            include: {
                registrations: true,
                creator: true,
            },
            orderBy: {
                date: 'desc',
            },
        });

        return new Response(JSON.stringify({ upcoming: upcomingEvents, past: pastEvents }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching events' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
