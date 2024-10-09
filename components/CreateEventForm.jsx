"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

export default function CreateEventForm({ userId }) {
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        time: "",
        location: "",
        type: "",
        maxPlayers: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSelectChange = (value, id) => {
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/events/manage/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    maxPlayers: parseInt(formData.maxPlayers),
                    creatorId: userId,
                }),
            });

            if (response.ok) {
                const event = await response.json();
                toast.success(`Successfully created event: ${event.name}`);
                setFormData({
                    name: "",
                    date: "",
                    time: "",
                    location: "",
                    type: "",
                    maxPlayers: "",
                    description: "",
                });
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
        } catch (error) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="px-4 md:px-6">
            <div className="mx-auto space-y-2">
                <h1 className="text-2xl font-bold">Create New Event</h1>
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Event Details
                            </CardTitle>
                            <CardDescription>
                                Fill in the details for your new football event.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                <Label htmlFor="date">Date</Label>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 opacity-70" />
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 opacity-70" />
                                    <Input
                                        id="time"
                                        type="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 opacity-70" />
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. MIT Football Ground"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Event Type</Label>
                                <Select
                                    onValueChange={(value) =>
                                        handleSelectChange(value, "type")
                                    }
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select event type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="match">
                                            Match
                                        </SelectItem>
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
                                <Label htmlFor="maxPlayers">
                                    Maximum Players
                                </Label>
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2 opacity-70" />
                                    <Input
                                        id="maxPlayers"
                                        type="number"
                                        value={formData.maxPlayers}
                                        onChange={handleChange}
                                        placeholder="e.g. 12"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Provide any additional details about the event..."
                                    rows={4}
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Event"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </main>
    );
}
