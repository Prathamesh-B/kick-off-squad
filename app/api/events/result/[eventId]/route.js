import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = params;
    const { team1Score, team2Score } = await request.json();

    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: { creator: true },
    });

    if (!event || event.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to declare result for this event" },
        { status: 403 },
      );
    }

    const result = await prisma.result.upsert({
      where: { eventId: parseInt(eventId) },
      update: { team1Score, team2Score },
      create: {
        eventId: parseInt(eventId),
        team1Score,
        team2Score,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error declaring result:", error);
    return NextResponse.json(
      { error: "Failed to declare result" },
      { status: 500 },
    );
  }
}
