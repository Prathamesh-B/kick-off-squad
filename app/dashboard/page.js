"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr'
import EventCard from "@/components/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoader } from "@/components/PageLoader";
import Pagination from "@/components/Pagination";

const EventsSection = ({ type }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const { data, error, mutate } = useSWR(
    `/api/events/${type}?page=${currentPage}&limit=6`, {
    refreshInterval: 10000,
  }
  );

  useEffect(() => {
    mutate();
  }, [currentPage, mutate]);

  const handleRegistrationUpdate = (updatedEvent) => {
    if (!data) return;

    const optimisticData = {
      ...data,
      events: data.events.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    };

    mutate(optimisticData, false);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  if (error) return <div>Failed to load events</div>
  if (!data) return <PageLoader type="events" />

  const { events, totalPages } = data;

  return (
    <div className="space-y-6">
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'upcoming';

  const handleTabChange = (newTab) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', newTab);
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-6 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Events</h1>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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