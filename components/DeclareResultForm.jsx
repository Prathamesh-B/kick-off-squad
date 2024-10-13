"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function DeclareResultForm({
  event,
  isOpen,
  onClose,
  onResultDeclared,
}) {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/events/result/${event.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team1Score: parseInt(team1Score),
          team2Score: parseInt(team2Score),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to declare result");
      }

      const result = await response.json();
      onResultDeclared(result);
      toast.success("Result declared successfully");
      onClose();
    } catch (error) {
      console.error("Error declaring result:", error);
      toast.error("Failed to declare result");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Declare Result for {event.name}</DialogTitle>
          <DialogDescription>
            You <strong>cannot change</strong> the result once it has been
            declared
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label htmlFor="team1Score" className="block text-sm font-medium">
                Team 1 Score
              </label>
              <Input
                id="team1Score"
                type="number"
                value={team1Score}
                onChange={(e) => setTeam1Score(e.target.value)}
                min="0"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="team2Score" className="block text-sm font-medium">
                Team 2 Score
              </label>
              <Input
                id="team2Score"
                type="number"
                value={team2Score}
                onChange={(e) => setTeam2Score(e.target.value)}
                min="0"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Declaring..." : "Declare Result"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
