import prisma from '@/lib/prisma';

// Create an event
export async function POST(req) {
    try {
        const body = await req.json()
        const { name, date, time, location, type, maxPlayers, description, creatorId } = body
        console.log({ name, date, time, location, type, maxPlayers, description, creatorId })
        const event = await prisma.event.create({
            data: {
                name,
                date: new Date(date),
                time,
                location,
                type,
                maxPlayers: parseInt(maxPlayers),
                description,
                creatorId: creatorId,
            },
        })

        return new Response(JSON.stringify(event), { status: 201 })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Unable to create event' }), { status: 400 })
    }
}

export function OPTIONS() {
    return new Response(null, {
        headers: {
            'Allow': 'POST',
        },
        status: 204,
    })
}
