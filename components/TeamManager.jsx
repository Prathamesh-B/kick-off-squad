"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function TeamManager({ event, isOpen, onClose, onTeamsUpdate }) {
    const [team1, setTeam1] = useState([]);
    const [team2, setTeam2] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadExistingTeams();
        }
    }, [isOpen, event.id]);

    const loadExistingTeams = () => {
        const getPosition = (user) => {
            return user.skills?.position || "Unspecified";
        };

        const team1Players = event.registrations
            .filter((reg) => reg.team === 1 && reg.user)
            .map((reg) => ({
                userId: reg.user.id,
                name: reg.user.name,
                position: getPosition(reg.user),
            }));
        const team2Players = event.registrations
            .filter((reg) => reg.team === 2 && reg.user)
            .map((reg) => ({
                userId: reg.user.id,
                name: reg.user.name,
                position: getPosition(reg.user),
            }));

        setTeam1(team1Players);
        setTeam2(team2Players);
    };

    const generateTeams = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/events/teams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId: event.id }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate teams");
            }

            const { team1, team2 } = await response.json();
            setTeam1(team1);
            setTeam2(team2);
            toast.success("Teams generated successfully");
        } catch (error) {
            toast.error("Failed to generate teams. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const movePlayer = async (playerId, fromTeam, toTeam) => {
        if (!playerId) return;

        const originalTeam1 = [...team1];
        const originalTeam2 = [...team2];

        let newTeam1 = [...team1];
        let newTeam2 = [...team2];

        try {
            if (fromTeam === 1 && toTeam === 2) {
                const playerIndex = newTeam1.findIndex(
                    (p) => p.userId === playerId
                );
                if (playerIndex !== -1) {
                    const [player] = newTeam1.splice(playerIndex, 1);
                    newTeam2.push(player);
                }
            } else if (fromTeam === 2 && toTeam === 1) {
                const playerIndex = newTeam2.findIndex(
                    (p) => p.userId === playerId
                );
                if (playerIndex !== -1) {
                    const [player] = newTeam2.splice(playerIndex, 1);
                    newTeam1.push(player);
                }
            }

            setTeam1(newTeam1);
            setTeam2(newTeam2);

            const response = await fetch("/api/events/teams", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId: event.id,
                    team1: newTeam1.map((p) => p.userId),
                    team2: newTeam2.map((p) => p.userId),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update teams");
            }

            const updatedData = await response.json();

            setTeam1(updatedData.team1);
            setTeam2(updatedData.team2);

            toast.success("Player moved successfully");
            onTeamsUpdate &&
                onTeamsUpdate({
                    team1: updatedData.team1,
                    team2: updatedData.team2,
                });
        } catch (error) {
            console.error("Error moving player:", error);
            setTeam1(originalTeam1);
            setTeam2(originalTeam2);
            toast.error("Failed to update teams");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-4 sm:p-6 lg:p-8 overflow-auto max-h-screen">
                <DialogHeader>
                    <DialogTitle>Manage Teams - {event.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Button
                        onClick={generateTeams}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? "Generating..." : "Regenerate Teams"}
                    </Button>

                    <div className="grid md:grid-cols-2 gap-1">
                        <div className="border p-4 rounded-lg">
                            <h3 className="font-bold mb-2">
                                Team 1 ({team1.length} players)
                            </h3>
                            {team1.map((player) => (
                                <div
                                    key={player.userId}
                                    className="flex justify-between items-center bg-white dark:bg-slate-900 p-2 mb-2 rounded shadow"
                                >
                                    <span className="text-sm">
                                        {player.name} - {player.position}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() =>
                                            movePlayer(player.userId, 1, 2)
                                        }
                                    >
                                        Move to Team 2
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="border p-4 rounded-lg">
                            <h3 className="font-bold mb-2">
                                Team 2 ({team2.length} players)
                            </h3>
                            {team2.map((player) => (
                                <div
                                    key={player.userId}
                                    className="flex justify-between items-center bg-white dark:bg-slate-900 p-2 mb-2 rounded shadow"
                                >
                                    <span className="text-sm">
                                        {player.name} - {player.position}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() =>
                                            movePlayer(player.userId, 2, 1)
                                        }
                                    >
                                        Move to Team 1
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
