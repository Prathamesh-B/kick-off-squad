"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from 'sonner'
import { PageLoader } from "@/components/PageLoader"
import useSWR, { fetcher } from 'swr'


export default function Component() {
    const { data, error, mutate } = useSWR('/api/user/profile', fetcher)
    const [isLoading, setIsLoading] = useState(false)
    const [skills, setSkills] = useState({
        passing: 3,
        shooting: 3,
        teamwork: 3,
        defending: 3,
        positioning: 3,
        position: ''
    })

    useEffect(() => {
        if (data?.skills) {
            setSkills(data.skills)
        }
    }, [data])

    const handleSkillChange = (skill, value) => {
        setSkills(prev => ({
            ...prev,
            [skill]: value[0]
        }))
    }

    const handlePositionChange = (e) => {
        setSkills(prev => ({
            ...prev,
            position: e.target.value
        }))
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/user/skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(skills),
            })

            if (!response.ok) throw new Error('Failed to save skills')

            mutate({
                ...data,
                skills: skills
            }, false)

            toast.success('Profile updated successfully')
        } catch (error) {
            console.error('Error saving skills:', error)
            toast.error('Failed to save profile')
        } finally {
            setIsLoading(false)
        }
    }

    if (error) return <div>Failed to load profile</div>
    if (!data) return <PageLoader type="profile" />

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
                                <Input disabled id="name" value={data.user?.name || ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input disabled id="email" value={data.user?.email || ''} type="email" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Assessment</CardTitle>
                            <CardDescription>Rate your skills on a scale of 1-5.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {Object.entries(skills).filter(([key]) => key !== 'position' && key !== 'userId' && key !== 'id').map(([skill, value]) => (
                                <div key={skill} className="space-y-2">
                                    <Label htmlFor={skill}>{skill.charAt(0).toUpperCase() + skill.slice(1)}</Label>
                                    <Slider
                                        id={skill}
                                        max={5}
                                        step={1}
                                        value={[value]}
                                        onValueChange={(value) => handleSkillChange(skill, value)}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        {[0, 1, 2, 3, 4, 5].map(num => (
                                            <span key={num}>{num}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="space-y-2">
                                <Label htmlFor="position">Preferred Position</Label>
                                <Input
                                    id="position"
                                    placeholder="e.g. Striker, Midfielder"
                                    value={skills.position}
                                    onChange={handlePositionChange}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Profile'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}