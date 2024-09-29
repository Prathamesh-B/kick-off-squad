import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function Component() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 py-6 px-4 md:px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold">Your Profile</h1>
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input disabled id="name" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input disabled id="email" placeholder="john@example.com" type="email" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Assessment</CardTitle>
                            <CardDescription>Rate your skills on a scale of 1-5.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="passing">Passing</Label>
                                <Slider
                                    id="passing"
                                    max={5}
                                    step={1}
                                    defaultValue={[3]}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>0</span>
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shooting">Shooting</Label>
                                <Slider
                                    id="shooting"
                                    max={5}
                                    step={1}
                                    defaultValue={[3]}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>0</span>
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="teamwork">Teamwork</Label>
                                <Slider
                                    id="teamwork"
                                    max={5}
                                    step={1}
                                    defaultValue={[3]}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>0</span>
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="defending">Defending</Label>
                                <Slider
                                    id="defending"
                                    max={5}
                                    step={1}
                                    defaultValue={[3]}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>0</span>
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="positioning">Positioning</Label>
                                <Slider
                                    id="positioning"
                                    max={5}
                                    step={1}
                                    defaultValue={[3]}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>0</span>
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Preferred Position</Label>
                                <Input id="position" placeholder="e.g. Striker, Midfielder" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Save Profile</Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}