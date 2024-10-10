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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Trophy,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useSWR from "swr";
import { PageLoader } from "./PageLoader";

export default function CreateEventForm({ userId }) {
    const router = useRouter();
    const [showUpiDialog, setShowUpiDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { data: profileData, error: profileError } =
        useSWR("/api/user/profile");

    const [formData, setFormData] = useState({
        name: "",
        date: "",
        time: "",
        location: "",
        type: "",
        maxPlayers: "",
        description: "",
    });

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.id]: e.target.value,
        }));
    };

    const handleSelectChange = (value, id) => {
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            date: "",
            time: "",
            location: "",
            type: "",
            maxPlayers: "",
            description: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profileData?.user?.upiId) {
            setShowUpiDialog(true);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const dateTime = new Date(
                `${formData.date}T${formData.time}`
            ).toISOString();

            const response = await fetch("/api/events/manage/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    dateTime,
                    maxPlayers: parseInt(formData.maxPlayers, 10),
                    creatorId: userId,
                }),
            });

            if (response.ok) {
                const event = await response.json();
                toast.success(`Successfully created event: ${event.name}`);
                resetForm();
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
        } catch (error) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (profileError) return <div>Failed to load user profile</div>;
    if (!profileData) return <PageLoader />;

    return (
        <main className="px-4 md:px-6">
            <div className="mx-auto space-y-4">
                <h1 className="text-2xl font-bold">Create New Event</h1>
                {profileData?.user?.upiId ? (
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Your UPI Id
                            </p>
                            <p className="font-medium">
                                {profileData.user.upiId}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/profile")}
                        >
                            Update UPI
                        </Button>
                    </div>
                ) : (
                    <Alert variant="warning">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="mt-1">
                            You need to set up your UPI Id before creating
                            events.
                            <Button
                                variant="link"
                                className="ml-2 h-auto p-0"
                                onClick={() => router.push("/profile")}
                            >
                                Set up now
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Event Details
                            </CardTitle>
                            <CardDescription>
                                Fill in the details for your new football event.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Event Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Saturday League Match"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 opacity-70" />
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                    <Button
                                        className="ml-2"
                                        variant="outline"
                                        type="button"
                                        onClick={() =>
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                date: new Date()
                                                    .toISOString()
                                                    .split("T")[0],
                                            }))
                                        }
                                    >
                                        Today
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 opacity-70" />
                                    <Input
                                        id="time"
                                        type="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 opacity-70" />
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. MIT Football Ground"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Event Type</Label>
                                <div className="flex items-center">
                                    <Trophy className="w-4 h-4 mr-2 opacity-70" />
                                    <Select
                                        onValueChange={(value) =>
                                            handleSelectChange(value, "type")
                                        }
                                    >
                                        <SelectTrigger id="type">
                                            <SelectValue placeholder="Select event type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="match">
                                                Match
                                            </SelectItem>
                                            <SelectItem value="practice">
                                                Practice
                                            </SelectItem>
                                            <SelectItem value="tournament">
                                                Tournament
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxPlayers">
                                    Maximum Players
                                </Label>
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2 opacity-70" />
                                    <Input
                                        id="maxPlayers"
                                        type="number"
                                        value={formData.maxPlayers}
                                        onChange={handleChange}
                                        placeholder="e.g. 10, 12"
                                    />
                                    <Button
                                        variant="outline"
                                        className="ml-2"
                                        type="button"
                                        onClick={() =>
                                            handleSelectChange(12, "maxPlayers")
                                        }
                                    >
                                        12
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Provide any additional details about the event..."
                                    rows={4}
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    loading || !profileData?.user?.upiId
                                }
                            >
                                {loading ? "Creating..." : "Create Event"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
            <Dialog open={showUpiDialog} onOpenChange={setShowUpiDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>UPI Setup Required</DialogTitle>
                        <DialogDescription>
                            To create an event, you need to set up your UPI Id first. This helps with managing payments for your events.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setShowUpiDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => router.push("/profile")}>
                            Set Up UPI
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
