import prisma from '@/lib/prisma';
import { auth } from '@/auth'

function isValidUpiFormat(upiId) {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(upiId);
}

export async function POST(request) {
    try {
        const session = await auth()
        if (!session) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const { upiId } = await request.json()

        if (!isValidUpiFormat(upiId)) {
            return new Response(JSON.stringify({ error: 'Invalid UPI ID format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: { upiId },
        })

        return new Response(JSON.stringify({
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                upiId: updatedUser.upiId,
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