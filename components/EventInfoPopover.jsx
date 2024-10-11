import { Info } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EventInfoPopover({ creator, registrations }) {
    const safeCreator = creator || { name: "Unknown", email: "", image: "" };
    const safeRegistrations = registrations || [];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Info className="h-4 w-4 pt-0.5 hover:cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="w-80" align="center">
                <div className="space-y-4">
                    { creator && <div>
                        <h4 className="font-semibold mb-2">Creator</h4>
                        <div className="flex items-center space-x-2">
                            <Avatar>
                                <AvatarImage src={safeCreator.image} />
                                <AvatarFallback>
                                    {safeCreator.name?.[0] || "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">
                                    {safeCreator.name || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {safeCreator.email || "No email"}
                                </p>
                            </div>
                        </div>
                    </div>}
                    <div>
                        <h4 className="font-semibold mb-2">
                            Registered Players ({safeRegistrations.length})
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {safeRegistrations.map((reg) => {
                                const user = reg.user || {
                                    name: "Unknown",
                                    email: "",
                                    image: "",
                                };
                                return (
                                    <div
                                        key={user.id || Math.random()}
                                        className="flex items-center space-x-2"
                                    >
                                        <Avatar>
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback>
                                                {user.name?.[0] || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {user.name || "Unknown"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user.email || "No email"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
