import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function GET(req) {
    const session = await auth()
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('userEmail')

    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        })

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
        }

        const events = await prisma.event.findMany({
            where: { creatorId: user.id },
        })
        return new Response(JSON.stringify(events), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Unable to fetch events' }), { status: 400 })
    }
}

export async function POST(req) {
    const session = await auth()
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    try {
        const body = await req.json()
        const { name, date, time, location, type, maxPlayers, description, creatorEmail } = body

        const user = await prisma.user.findUnique({
            where: { email: creatorEmail },
        })

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
        }

        const event = await prisma.event.create({
            data: {
                name,
                date: new Date(date),
                time,
                location,
                type,
                maxPlayers: parseInt(maxPlayers),
                description,
                creatorId: user.id,
            },
        })

        return new Response(JSON.stringify(event), { status: 201 })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Unable to create event' }), { status: 400 })
    }
}