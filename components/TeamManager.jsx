"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCw } from "lucide-react";

const PlayerCard = ({ player, onMove, isMoving, toTeam }) => (
  <div className="mb-2 flex items-center justify-between rounded-lg bg-white p-3 shadow-md transition-all dark:bg-slate-900">
    <div>
      <span className="text-sm font-medium">{player.name}</span>
      <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
        {player.position}
      </span>
    </div>
    <Button
      size="sm"
      variant="secondary"
      onClick={() => onMove(player.userId)}
      disabled={isMoving}
    >
      Move to Team {toTeam}
    </Button>
  </div>
);

const TeamList = ({ teamNumber, players, onMovePlayer, isMoving }) => (
  <div className="rounded-lg border p-4">
    <h3 className="mb-3 text-lg font-bold">
      Team {teamNumber} ({players.length} players)
    </h3>
    {players.map((player) => (
      <PlayerCard
        key={player.userId}
        player={player}
        onMove={(playerId) =>
          onMovePlayer(playerId, teamNumber, teamNumber === 1 ? 2 : 1)
        }
        isMoving={isMoving}
        toTeam={teamNumber === 1 ? 2 : 1}
      />
    ))}
  </div>
);

export default function TeamManager({ event, isOpen, onClose, onTeamsUpdate }) {
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
    if (!playerId || isMoving) return;

    setIsMoving(true);
    const originalTeam1 = [...team1];
    const originalTeam2 = [...team2];

    let newTeam1 = [...team1];
    let newTeam2 = [...team2];

    try {
      if (fromTeam === 1 && toTeam === 2) {
        const playerIndex = newTeam1.findIndex((p) => p.userId === playerId);
        if (playerIndex !== -1) {
          const [player] = newTeam1.splice(playerIndex, 1);
          newTeam2.push(player);
        }
      } else if (fromTeam === 2 && toTeam === 1) {
        const playerIndex = newTeam2.findIndex((p) => p.userId === playerId);
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
    } catch (error) {
      console.error("Error moving player:", error);
      setTeam1(originalTeam1);
      setTeam2(originalTeam2);
      toast.error("Failed to update teams");
    } finally {
      setIsMoving(false);
    }
  };

  const handleClose = () => {
    onTeamsUpdate && onTeamsUpdate();
    onClose();
  };

  const filteredTeam1 = team1.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTeam2 = team2.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-h-screen max-w-4xl overflow-auto p-4 sm:p-6 lg:p-8">
        <DialogHeader>
          <DialogTitle>Manage Teams - {event.name}</DialogTitle>
          <DialogDescription>
            Manage your teams for this event
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={generateTeams} disabled={isLoading} className="w-48">
            <RefreshCw className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Regenerate Teams"}
          </Button>
          <div className="grid gap-6 md:grid-cols-2">
            <TeamList
              teamNumber={1}
              players={filteredTeam1}
              onMovePlayer={movePlayer}
              isMoving={isMoving}
            />
            <TeamList
              teamNumber={2}
              players={filteredTeam2}
              onMovePlayer={movePlayer}
              isMoving={isMoving}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
