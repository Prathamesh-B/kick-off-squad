import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// Show all events created by a user
export async function GET(req) {
    const session = await auth()
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('userEmail')

    try {
        const events = await prisma.event.findMany({
            where: { creatorEmail: userEmail },
        })
        return new Response(JSON.stringify(events), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Unable to fetch events' }), { status: 400 })
    }
}