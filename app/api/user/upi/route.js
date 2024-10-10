import prisma from '@/lib/prisma';
import { auth } from '@/auth'

export async function POST(request) {
    try {
        const session = await auth()
        if (!session) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const { upiNumber } = await request.json()

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: { upiNumber },
        })

        return new Response(JSON.stringify({
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                upiNumber: updatedUser.upiNumber,
            }
        }), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}