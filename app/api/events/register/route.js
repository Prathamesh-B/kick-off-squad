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

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { registrations: true },
        });

        if (!event) {
            return new Response(JSON.stringify({ error: 'Event not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (event.dateTime < new Date()) {
            return new Response(JSON.stringify({ error: 'Event has already happened' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (event.registrations.length >= event.maxPlayers) {
            return new Response(JSON.stringify({ error: 'Event is full' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingRegistration = await prisma.registration.findFirst({
            where: {
                userId: session.user.id,
                eventId,
            },
        });

        if (existingRegistration) {
            return new Response(JSON.stringify({ error: 'Already registered' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await prisma.registration.create({
            data: {
                userId: session.user.id,
                eventId,
            },
        });

        const updatedEvent = await prisma.event.findUnique({
            where: { id: eventId },
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
        });

        return new Response(JSON.stringify(updatedEvent), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, max-age=0, must-revalidate', },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to register' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, max-age=0, must-revalidate', },
        });
    }
}