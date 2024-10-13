import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
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
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to unregister" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  }
}
