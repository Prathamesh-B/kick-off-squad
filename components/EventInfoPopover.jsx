import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EventInfoPopover({ creator, registrations }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1 p-0">
                    <Info className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Creator</h4>
                        <div className="flex items-center space-x-2">
                            <Avatar>
                                <AvatarImage src={creator.image} />
                                <AvatarFallback>
                                    {creator.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">
                                    {creator.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {creator.email}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">
                            Registered Players ({registrations.length})
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {registrations.map((reg) => (
                                <div
                                    key={reg.user.id}
                                    className="flex items-center space-x-2"
                                >
                                    <Avatar>
                                        <AvatarImage src={reg.user.image} />
                                        <AvatarFallback>
                                            {reg.user.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {reg.user.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {reg.user.email}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
