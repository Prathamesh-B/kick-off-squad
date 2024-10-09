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
import { PageLoader } from "@/components/PageLoader";
import { Calendar, MapPin, Users, Edit, Trash } from "lucide-react";
import EditEventForm from "./EditEventForm";
import { toast } from "sonner";

export default function UserEvents({ userId }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);

    useEffect(() => {
        fetchUserEvents();
    }, [userId]);

    const fetchUserEvents = async () => {
        try {
            const response = await fetch(
                `/api/events/manage?userId=${encodeURIComponent(userId)}`
            );
            if (!response.ok) throw new Error("Failed to fetch events");
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching user events:", error);
            toast.error("Failed to load your events");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
    };

    const handleEventUpdate = (updatedEvent) => {
        setEvents(
            events.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        );
    };

    const handleDelete = async (eventId) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            const response = await fetch(
                `/api/events/manage/delete/${eventId}`,
                {
                    method: "DELETE",
                }
            );
            if (!response.ok) throw new Error("Failed to delete event");

            setEvents(events.filter((event) => event.id !== eventId));
            toast.success("Event deleted successfully");
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Failed to delete event");
        }
    };

    if (loading) {
        return <PageLoader type="events" />;
    }

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2">
                {events.length === 0 ? (
                    <p>You haven&apos;t created any events yet.</p>
                ) : (
                    events.map((event) => (
                        <Card key={event.id}>
                            <CardHeader>
                                <CardTitle>{event.name}</CardTitle>
                                <CardDescription>
                                    {event.description ||
                                        "No description provided"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {new Date(
                                            event.dateTime
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Users className="h-4 w-4" />
                                    <span>
                                        {event.registrations?.length || 0}/
                                        {event.maxPlayers} players registered
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => handleEdit(event)}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
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
                    ))
                )}
            </div>
            {editingEvent && (
                <EditEventForm
                    event={editingEvent}
                    isOpen={!!editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onEventUpdate={handleEventUpdate}
                />
            )}
        </>
    );
}
