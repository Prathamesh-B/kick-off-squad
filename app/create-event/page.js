import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MapPin, Users, Zap } from "lucide-react"

export default function Component() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 py-6 px-4 md:px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold">Create New Event</h1>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Event Details</CardTitle>
                            <CardDescription>Fill in the details for your new football event.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="event-name">Event Name</Label>
                                <Input id="event-name" placeholder="e.g. Saturday League Match" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="event-date">Date</Label>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 opacity-70" />
                                    <Input id="event-date" type="date" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="event-time">Time</Label>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 opacity-70" />
                                    <Input id="event-time" type="time" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="event-location">Location</Label>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 opacity-70" />
                                    <Input id="event-location" placeholder="e.g. MIT Football Ground" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="event-type">Event Type</Label>
                                <Select>
                                    <SelectTrigger id="event-type">
                                        <SelectValue placeholder="Select event type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="match">Match</SelectItem>
                                        <SelectItem value="practice">Practice</SelectItem>
                                        <SelectItem value="tournament">Tournament</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="max-players">Maximum Players</Label>
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2 opacity-70" />
                                    <Input id="max-players" type="number" placeholder="e.g. 12" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="event-description">Description</Label>
                                <Textarea
                                    id="event-description"
                                    placeholder="Provide any additional details about the event..."
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Create Event</Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}