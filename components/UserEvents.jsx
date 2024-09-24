"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Edit } from "lucide-react";
import { Trash } from "lucide-react";

export default function UserEvents({ userEmail }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserEvents();
    }, [userEmail]);

    const fetchUserEvents = async () => {
        try {
            const response = await fetch(
                `/api/events?userEmail=${encodeURIComponent(userEmail)}`
            );
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else {
                setError("Failed to fetch events");
            }
        } catch (error) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (confirm("Are you sure you want to delete this event?")) {
            try {
                const response = await fetch(`/api/events/${eventId}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    setEvents(events.filter((event) => event.id !== eventId));
                } else {
                    setError("Failed to delete event");
                }
            } catch (error) {
                setError("An unexpected error occurred");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <main className="px-4 md:px-6">
            <div className="mx-auto space-y-2">
                <h1 className="text-2xl font-bold">Your Events</h1>
                <div className="grid gap-6 md:grid-cols-2">
                    {events.map((event) => (
                        <Card key={event.id}>
                            <CardHeader>
                                <CardTitle>{event.name}</CardTitle>
                                <CardDescription>
                                    {new Date(event.date).toLocaleDateString()}{" "}
                                    | {event.time}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Location: {event.location}</p>
                                <p>Type: {event.type}</p>
                                <p>Max Players: {event.maxPlayers}</p>
                                <p>Description: {event.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">
                                    <Edit
                                        className="w-4 h-4 mr-2"
                                        onClick={() => handleEdit(event.id)}
                                    />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(event.id)}
                                >
                                    <Trash className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
