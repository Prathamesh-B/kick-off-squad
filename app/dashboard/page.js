import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

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
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Saturday League Match</CardTitle>
                                        <CardDescription>Upcoming football event</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Saturday, July 15, 2023</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                            <Clock className="h-4 w-4" />
                                            <span>2:00 PM - 4:00 PM</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>Central Park Football Ground</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Users className="h-4 w-4" />
                                            <span>8/12 players registered</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full">Register</Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="past">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sunday Friendly Match</CardTitle>
                                        <CardDescription>Past football event</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Sunday, July 2, 2023</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                            <Clock className="h-4 w-4" />
                                            <span>3:00 PM - 5:00 PM</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>Community Sports Center</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Users className="h-4 w-4" />
                                            <span>20 players participated</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" className="w-full">View Results</Button>
                                    </CardFooter>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Inter-Class Tournament</CardTitle>
                                        <CardDescription>Past football event</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Saturday, June 24, 2023</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                            <Clock className="h-4 w-4" />
                                            <span>9:00 AM - 4:00 PM</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>School Sports Complex</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Users className="h-4 w-4" />
                                            <span>64 players participated</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" className="w-full">View Results</Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}