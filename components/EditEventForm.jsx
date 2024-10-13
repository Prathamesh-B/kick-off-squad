"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/formatDateTime";

export default function EditEventForm({
  event,
  isOpen,
  onClose,
  onEventUpdate,
}) {
  const [formData, setFormData] = useState({
    name: event.name,
    dateTime: formatDateTime(event.dateTime, true),
    location: event.location,
    type: event.type,
    maxPlayers: event.maxPlayers,
    description: event.description || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/events/manage/edit/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          dateTime: new Date(formData.dateTime).toISOString(),
          maxPlayers: parseInt(formData.maxPlayers),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updatedEvent = await response.json();
      onEventUpdate(updatedEvent);
      onClose();
      toast.success("Event updated successfully");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>Edit the details of the event.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Saturday League Match"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateTime">Date and Time</Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. MIT Football Ground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Select
              onValueChange={handleSelectChange}
              defaultValue={formData.type}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Match</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="tournament">Tournament</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Maximum Players</Label>
            <Input
              id="maxPlayers"
              type="number"
              value={formData.maxPlayers}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              maxLength={100}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
