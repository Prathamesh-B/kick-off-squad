"use client"

import { useSession } from "next-auth/react"
import CreateEventForm from "@/components/CreateEventForm"
import UserEvents from "@/components/UserEvents"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EventsPage() {
    const { data: session } = useSession()

    if (!session) {
        return <div>Please sign in to access this page.</div>
    }

    return (
        <div className="min-h-screen">
            <main className="py-6 px-4 md:px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold">Manage Events</h1>
                    <Tabs defaultValue="create" className="w-full">
                        <TabsList>
                            <TabsTrigger value="create">Create Event</TabsTrigger>
                            <TabsTrigger value="manage">Manage Events</TabsTrigger>
                        </TabsList>
                        <TabsContent value="create">
                            <CreateEventForm userId={session.user.id} />
                        </TabsContent>
                        <TabsContent value="manage">
                            <UserEvents userId={session.user.id} />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}