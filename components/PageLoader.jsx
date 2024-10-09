import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PageLoader({ type = "default" }) {
    if (type === "events") {
        return (
            <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-4/5" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="flex items-center space-x-2">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Skeleton className="h-10 w-3/4" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    if (type === "profile") {
        return (
            <div className="max-w-2xl mx-auto space-y-8">
                <Skeleton className="h-10 w-48" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-40" />
                        <Skeleton className="h-5 w-60" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-full" />
                                <div className="flex justify-between">
                                    {[1, 2, 3, 4, 5, 6].map((j) => (
                                        <Skeleton key={j} className="h-4 w-4" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // Default loader
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-10 w-48" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}