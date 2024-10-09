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

        const skills = await request.json()

        await prisma.skill.upsert({
            where: { userId: session.user.id },
            update: {
                passing: skills.passing,
                shooting: skills.shooting,
                teamwork: skills.teamwork,
                defending: skills.defending,
                positioning: skills.positioning,
                position: skills.position,
            },
            create: {
                userId: session.user.id,
                passing: skills.passing,
                shooting: skills.shooting,
                teamwork: skills.teamwork,
                defending: skills.defending,
                positioning: skills.positioning,
                position: skills.position,
            },
        })

        return new Response(JSON.stringify({ message: 'Skills updated successfully' }), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}