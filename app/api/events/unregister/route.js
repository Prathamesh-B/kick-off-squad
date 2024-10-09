import { auth } from "@/auth";
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const session = await auth();
        if (!session) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { eventId } = await request.json();

        await prisma.registration.deleteMany({
            where: {
                userId: session.user.id,
                eventId,
            },
        });

        const updatedEvent = await prisma.event.findUnique({
            where: { id: eventId },
            include: { registrations: true },
        });

        return new Response(JSON.stringify(updatedEvent), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to unregister' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}