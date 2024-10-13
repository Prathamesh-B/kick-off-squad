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
import { PageLoader } from "@/components/PageLoader";
import { Calendar, MapPin, Users, Edit, Trash, Trophy } from "lucide-react";
import EditEventForm from "./EditEventForm";
import DeclareResultForm from "./DeclareResultForm";
import TeamManager from "./TeamManager";
import { toast } from "sonner";
import useSWR from "swr";
import { formatDateTime } from "@/lib/formatDateTime";
import EventInfoPopover from "./EventInfoPopover";
import Pagination from "./Pagination";

export default function UserEvents({ userId }) {
  const [editingEvent, setEditingEvent] = useState(null);
  const [declaringResult, setDeclaringResult] = useState(null);
  const [showTeams, setShowTeams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, mutate } = useSWR(
    userId
      ? `/api/events/manage?userId=${encodeURIComponent(
          userId,
        )}&page=${currentPage}&limit=6`
      : null,
  );

  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/events/manage/delete/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      toast.success("Event deleted successfully");
      const optimisticEvents = data.events.filter(
        (event) => event.id !== eventId,
      );
      mutate()({ ...data, events: optimisticEvents }, false);
    } catch (error) {
      mutate()();
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const toggleTeams = (eventId) => {
    setShowTeams((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const isPastEvent = (event) => {
    return new Date(event.dateTime) < new Date();
  };

  if (error) return <div>Failed to load events</div>;
  if (!data) return <PageLoader type="events" />;

  const { events = [], totalPages } = data || {};

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {events && events.length === 0 ? (
          <p>You haven&apos;t created any events yet.</p>
        ) : (
          events &&
          events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>
                  {event.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(event.dateTime)}</span>
                </div>
                <div className="mb-2 flex items-center space-x-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>
                    {event.registrations?.length || 0}/{event.maxPlayers}{" "}
                    players registered
                  </span>
                  <EventInfoPopover registrations={event.registrations} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <div className="flex w-full flex-wrap justify-between gap-2">
                  <Button variant="outline" onClick={() => handleEdit(event)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  {!isPastEvent(event) && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => toggleTeams(event.id)}
                        disabled={event.registrations?.length < 2}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Teams
                      </Button>
                      {showTeams[event.id] && (
                        <TeamManager
                          event={event}
                          isOpen={showTeams[event.id]}
                          onClose={() => {
                            toggleTeams(event.id);
                            mutate()();
                          }}
                        />
                      )}
                    </>
                  )}
                  {isPastEvent(event) && !event.result && (
                    <Button
                      variant="outline"
                      onClick={() => setDeclaringResult(event)}
                    >
                      <Trophy className="mr-2 h-4 w-4" />
                      Result
                    </Button>
                  )}
                  {event.result && (
                    <span className="mt-1">
                      Result: {event.result.team1Score} -{" "}
                      {event.result.team2Score}
                    </span>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
                {showTeams[event.id] && !isPastEvent(event) && (
                  <div className="w-full">
                    <TeamManager
                      event={event}
                      isOpen={showTeams[event.id]}
                      onClose={() => {
                        toggleTeams(event.id);
                        mutate();
                      }}
                    />
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {editingEvent && (
        <EditEventForm
          event={editingEvent}
          isOpen={!!editingEvent}
          onClose={() => {
            setEditingEvent(null);
            mutate();
          }}
        />
      )}
      {declaringResult && (
        <DeclareResultForm
          event={declaringResult}
          isOpen={!!declaringResult}
          onClose={() => setDeclaringResult(null)}
          onResultDeclared={(result) => {
            const updatedEvents = events.map((event) =>
              event.id === result.eventId
                ? { ...event, result: result }
                : event,
            );
            mutate({ ...data, events: updatedEvents }, false);
            setDeclaringResult(null);
          }}
        />
      )}
    </>
  );
}
