import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// Delete an event
export async function DELETE(req, { params }) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: { creator: true },
    });

    if (!event) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
      });
    }

    if (event.creator.email !== session.user.email) {
      return new Response(
        JSON.stringify({ error: "Unauthorized to delete this event" }),
        { status: 403 },
      );
    }

    await prisma.event.delete({
      where: { id: parseInt(id) },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to delete event" }), {
      status: 400,
    });
  }
}
