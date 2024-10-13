"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from 'next/navigation';
import CreateEventForm from "@/components/CreateEventForm"
import UserEvents from "@/components/UserEvents"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EventsPage() {
    const { data: session } = useSession()
    const userId = session?.user?.id

    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'create';

    const handleTabChange = (newTab) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', newTab);
        router.push(`?${params.toString()}`);
    };

    if (!session) {
        return <div className="min-h-screen"><span className="text-2xl">Please sign in to access this page.</span></div>
    }

    return (
        <div className="min-h-screen">
            <main className="py-6 px-4 md:px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold">Manage Events</h1>
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList>
                            <TabsTrigger value="create">Create Event</TabsTrigger>
                            <TabsTrigger value="manage">Manage Events</TabsTrigger>
                        </TabsList>
                        <TabsContent value="create">
                            <CreateEventForm userId={userId} />
                        </TabsContent>
                        <TabsContent value="manage">
                            <UserEvents userId={userId} />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}