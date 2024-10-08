"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventInfoPopover from "@/components/EventInfoPopover";
import { Calendar, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { PageLoader } from "@/components/PageLoader";
import { formatDateTime } from "@/lib/formatDateTime";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { extractAmount } from "@/lib/extractAmount";
import useSWR from 'swr'

// Opt out of caching
export const dynamic = 'force-dynamic';

const EventCard = ({ event, isPast, onRegistrationUpdate }) => {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);

    const isUserRegistered = event.registrations.some(
        reg => reg.userId === session?.user?.id
    );

    const amount = extractAmount(event.description);

    const handlePaymentAndRegistration = async () => {
        setShowPaymentDialog(false);
        await handleRegistration();
    };

    const handleRegistrationClick = () => {
        if (amount && !isUserRegistered) {
            setShowPaymentDialog(true);
        } else {
            handleRegistration();
        }
    };

    const handleRegistration = async () => {
        if (!session) {
            toast.error("Please sign in to register for events");
            return;
        }

        setIsLoading(true);
        const endpoint = isUserRegistered ? '/api/events/unregister' : '/api/events/register';

        try {
            const optimisticEvent = {
                ...event,
                registrations: isUserRegistered
                    ? event.registrations.filter(reg => reg.userId !== session.user.id)
                    : [...event.registrations, { userId: session.user.id }]
            };

            onRegistrationUpdate(optimisticEvent);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId: event.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to process registration');
            }

            const updatedEvent = await response.json();

            onRegistrationUpdate(updatedEvent);

            toast.success(isUserRegistered ?
                "Successfully unregistered from event" :
                "Successfully registered for event"
            );
        } catch (error) {
            onRegistrationUpdate(event);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Card key={event.id}>
                <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>{event.description || (isPast ? "Past event" : "")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateTime(event.dateTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>
                            {isPast
                                ? `${event.registrations.length} players participated`
                                : `${event.registrations.length}/${event.maxPlayers} players registered`
                            }
                        </span>
                    </div>
                </CardContent>
                <CardFooter>
                    {isPast ? (
                        <>
                            {event.result ? (
                                <div className="w-full text-center">
                                    <p className="text-lg">
                                        <strong>Final Score: </strong>{event.result.team1Score} - {event.result.team2Score}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center w-full">
                                    Result not yet declared
                                </p>
                            )}
                        </>
                    ) : (
                        <Button
                            className="w-full"
                            onClick={handleRegistrationClick}
                            disabled={isLoading || (!isUserRegistered && event.registrations.length >= event.maxPlayers)}
                            variant={isUserRegistered ? "destructive" : "default"}
                        >
                            {isLoading
                                ? "Processing..."
                                : isUserRegistered
                                    ? "Unregister"
                                    : event.registrations.length >= event.maxPlayers
                                        ? "Event Full"
                                        : amount ? `Register (₹${amount})` : "Register"
                            }
                        </Button>
                    )}
                    <EventInfoPopover creator={event.creator || {}} registrations={event.registrations || []} />
                </CardFooter>
            </Card>
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Payment Required</DialogTitle>
                        <DialogDescription>
                            This event requires a payment of ₹{amount} to register.<br />
                            Please pay to <strong>{event?.creator?.name}</strong><br />
                            UPI Id: <strong>{event?.creator?.upiId}</strong><br />
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                        {event?.creator?.upiId && (
                            <Button
                                onClick={() => window.location.href = `upi://pay?pa=${event.creator.upiId}&pn=${event.creator.name}&am=${amount}&tn=Football | ${event.name}&cu=INR`}
                                className="w-full"
                                variant="outline"
                            >
                                Pay ₹{amount} with UPI
                            </Button>
                        )}
                        <Button
                            onClick={handlePaymentAndRegistration}
                            className="w-full"
                        >
                            I&apos;ve Made the Payment
                        </Button>
                        <Button
                            onClick={() => setShowPaymentDialog(false)}
                            variant="ghost"
                            className="w-full"
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

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

export default function Component() {
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
