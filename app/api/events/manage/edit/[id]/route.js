import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const eventId = parseInt(params.id);
    const { name, description, dateTime, location, maxPlayers } =
      await request.json();

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { creator: true },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (event.creator.id !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        name,
        description,
        dateTime: new Date(dateTime),
        location,
        maxPlayers: parseInt(maxPlayers),
      },
      include: {
        registrations: true,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Error updating event" },
      { status: 500 },
    );
  }
}
