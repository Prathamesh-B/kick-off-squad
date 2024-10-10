import { auth } from '@/auth'
import prisma from '@/lib/prisma'

// Show all events created by a user
export async function GET(req) {
    const session = await auth()
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
        return new Response(JSON.stringify({ error: 'Missing userId parameter' }), { status: 400 })
    }

    try {
        const events = await prisma.event.findMany({
            where: { creatorId: parseInt(userId) },
            include: { creator: true, registrations: true }
        })
        return new Response(JSON.stringify(events), {
            status: 200, headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
            },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Unable to fetch events' }), { status: 400 })
    }
}