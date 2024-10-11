import { auth } from '@/auth'
import prisma from '@/lib/prisma'

export async function GET(req) {
    const session = await auth()
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '6')
    const skip = (page - 1) * limit

    if (!userId) {
        return new Response(JSON.stringify({ error: 'Missing userId parameter' }), { status: 400 })
    }

    try {
        const [events, totalCount] = await Promise.all([
            prisma.event.findMany({
                where: { creatorId: parseInt(userId) },
                include: {
                    creator: true,
                    registrations: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    image: true,
                                    skills: true,
                                },
                            },
                        },
                    },
                    result: true
                },
                orderBy: { dateTime: 'desc' },
                skip,
                take: limit,
            }),
            prisma.event.count({
                where: { creatorId: parseInt(userId) }
            })
        ]);

        return new Response(JSON.stringify({
            events,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            totalCount
        }), {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
            },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Unable to fetch events' }), { status: 400 })
    }
}