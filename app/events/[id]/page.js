import EventDetails from '@/components/EventDetails';

export default function EventPage({ params }) {
  return <EventDetails id={params.id} />;
}