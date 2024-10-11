"use client";

import useSWR from 'swr'
import EventCard from "@/components/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoader } from "@/components/PageLoader";


const EventsSection = ({ type }) => {
    const { data: events, error, mutate } = useSWR(`/api/events/${type}`)

    const handleRegistrationUpdate = (updatedEvent) => {
        const optimisticData = events.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
        )

        mutate(optimisticData, false)
    };

    if (error) return <div>Failed to load events</div>
    if (!events) return <PageLoader type="events" />

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {events.length === 0 ? (
                <p>No {type} events found.</p>
            ) : (
                events.map(event => (
                    <EventCard
                        key={event.id}
                        event={event}
                        isPast={type === 'past'}
                        onRegistrationUpdate={handleRegistrationUpdate}
                    />
                ))
            )}
        </div>
    );
};

export default function DashboardPage() {
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
                            <EventsSection type="upcoming" />
                        </TabsContent>
                        <TabsContent value="past">
                            <EventsSection type="past" />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
