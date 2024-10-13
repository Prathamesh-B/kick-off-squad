import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { eventId } = await request.json();

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          include: {
            user: {
              include: {
                skills: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Calculate average skill for each player and create player array
    const players = event.registrations.map((reg) => ({
      userId: reg.user.id,
      name: reg.user.name,
      avgSkill: reg.user.skills
        ? (reg.user.skills.passing +
            reg.user.skills.shooting +
            reg.user.skills.teamwork +
            reg.user.skills.defending +
            reg.user.skills.positioning) /
          5
        : 3, // Default skill if not set
      position: reg.user.skills?.position || "Not specified",
    }));

    // After calculating player skills, sort by skill level before team assignment
    const sortedPlayers = players.sort((a, b) => b.avgSkill - a.avgSkill);

    // Distribute players alternately to ensure balance
    const team1Players = [];
    const team2Players = [];
    sortedPlayers.forEach((player, index) => {
      if (index % 2 === 0) {
        team1Players.push(player);
      } else {
        team2Players.push(player);
      }
    });

    // Update registrations with team assignments
    await Promise.all([
      ...team1Players.map((player) =>
        prisma.registration.update({
          where: {
            userId_eventId: {
              userId: player.userId,
              eventId: event.id,
            },
          },
          data: { team: 1 },
        }),
      ),
      ...team2Players.map((player) =>
        prisma.registration.update({
          where: {
            userId_eventId: {
              userId: player.userId,
              eventId: event.id,
            },
          },
          data: { team: 2 },
        }),
      ),
    ]);

    // Fetch updated event with all necessary data
    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          include: {
            user: {
              include: {
                skills: true,
              },
            },
          },
        },
      },
    });

    // Format teams for response
    const team1 = updatedEvent.registrations
      .filter((reg) => reg.team === 1)
      .map((reg) => ({
        userId: reg.user.id,
        name: reg.user.name,
        position: reg.user.skills?.position || "Not specified",
      }));

    const team2 = updatedEvent.registrations
      .filter((reg) => reg.team === 2)
      .map((reg) => ({
        userId: reg.user.id,
        name: reg.user.name,
        position: reg.user.skills?.position || "Not specified",
      }));

    return NextResponse.json({ team1, team2 });
  } catch (error) {
    console.error("Error generating teams:", error);
    return NextResponse.json(
      { error: "Failed to generate teams" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const { eventId, team1, team2 } = await request.json();

    // Filter out any null or undefined values
    const validTeam1 = team1.filter((id) => id != null);
    const validTeam2 = team2.filter((id) => id != null);

    // Update team assignments
    const updatePromises = [
      // Update team 1
      ...validTeam1.map((userId) =>
        prisma.registration.update({
          where: {
            userId_eventId: {
              userId: Number(userId), // Ensure userId is a number
              eventId: Number(eventId), // Ensure eventId is a number
            },
          },
          data: { team: 1 },
        }),
      ),
      // Update team 2
      ...validTeam2.map((userId) =>
        prisma.registration.update({
          where: {
            userId_eventId: {
              userId: Number(userId), // Ensure userId is a number
              eventId: Number(eventId), // Ensure eventId is a number
            },
          },
          data: { team: 2 },
        }),
      ),
    ];

    await Promise.all(updatePromises);

    // Fetch updated event with all necessary data
    const updatedEvent = await prisma.event.findUnique({
      where: { id: Number(eventId) },
      include: {
        registrations: {
          include: {
            user: {
              include: {
                skills: true,
              },
            },
          },
        },
      },
    });

    // Format teams for response
    const updatedTeam1 = updatedEvent.registrations
      .filter((reg) => reg.team === 1)
      .map((reg) => ({
        userId: reg.user.id,
        name: reg.user.name,
        position: reg.user.skills?.position || "Not specified",
      }));

    const updatedTeam2 = updatedEvent.registrations
      .filter((reg) => reg.team === 2)
      .map((reg) => ({
        userId: reg.user.id,
        name: reg.user.name,
        position: reg.user.skills?.position || "Not specified",
      }));

    return NextResponse.json({ team1: updatedTeam1, team2: updatedTeam2 });
  } catch (error) {
    console.error("Error updating teams:", error);
    return NextResponse.json(
      { error: "Failed to update teams" },
      { status: 500 },
    );
  }
}
