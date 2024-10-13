"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import { PageLoader } from "@/components/PageLoader";

export default function EventDetails({ id }) {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvent();
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!event) return <PageLoader type="event" />;

  const isPast = new Date(event.dateTime) < new Date();

  return (
    <main className="min-h-screen flex-1 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <EventCard
          event={event}
          isPast={isPast}
          onRegistrationUpdate={(updatedEvent) => setEvent(updatedEvent)}
        />
      </div>
    </main>
  );
}
