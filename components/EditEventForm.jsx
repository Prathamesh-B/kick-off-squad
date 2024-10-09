"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
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

export default function EditEventForm({
    event,
    isOpen,
    onClose,
    onEventUpdate,
}) {
    const [formData, setFormData] = useState({
        name: event.name,
        dateTime: new Date(event.dateTime).toISOString().slice(0, 16),
        location: event.location,
        type: event.type,
        maxPlayers: event.maxPlayers,
        description: event.description || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        setError(null);

        try {
            const response = await fetch(
                `/api/events/manage/edit/${event.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        dateTime: formData.dateTime,
                        location: formData.location,
                        type: formData.type,
                        maxPlayers: parseInt(formData.maxPlayers),
                        description: formData.description,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update event");
            }

            const updatedEvent = await response.json();
            onEventUpdate(updatedEvent);
            onClose();
            toast.success("Event updated successfully");
        } catch (error) {
            setError(error.message);
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
                        <Label htmlFor="date">Date and Time</Label>
                        <Input
                            id="dateTime"
                            name="dateTime"
                            type="datetime-local"
                            value={formData.dateTime}
                            onChange={handleChange}
                            required
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
                                <SelectItem value="practice">
                                    Practice
                                </SelectItem>
                                <SelectItem value="tournament">
                                    Tournament
                                </SelectItem>
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
                            placeholder="e.g. 12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide any additional details about the event..."
                            rows={2}
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Updating..." : "Update Event"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
