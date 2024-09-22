"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const EventCard = ({ event, isPast }) => (
    <Card key={event.id}>
        <CardHeader>
            <CardTitle>{event.name}</CardTitle>
            <CardDescription>{event.description || (isPast ? "Past event" : "")}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{isPast ? `${event.registrations.length} players participated` : `${event.registrations.length}/${event.maxPlayers} players registered`}</span>
            </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full">{isPast ? "View Results" : "Register"}</Button>
        </CardFooter>
    </Card>
);

export default function Component() {
    const [events, setEvents] = useState({ upcoming: [], past: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("/api/event");
                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 py-6 px-4 md:px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold">Events</h1>
                    <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList>
                            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                            <TabsTrigger value="past">Past Events</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upcoming">
                            <div className="grid gap-6 md:grid-cols-2">
                                {loading ? <p>Loading...</p> : events.upcoming.map(event => <EventCard key={event.id} event={event} isPast={false} />)}
                            </div>
                        </TabsContent>
                        <TabsContent value="past">
                            <div className="grid gap-6 md:grid-cols-2">
                                {loading ? <p>Loading...</p> : events.past.map(event => <EventCard key={event.id} event={event} isPast={true} />)}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
