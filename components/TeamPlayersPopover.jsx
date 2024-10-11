import { UsersRound } from "lucide-react";
import { Button } from "./ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function TeamPlayersPopover({ registrations }) {
    const getTeamPlayers = (teamNumber) => {
        return registrations
            .filter((reg) => reg.team === teamNumber && reg.user)
            .map((reg) => ({
                userId: reg.user.id,
                name: reg.user.name,
                position: reg.user.skills?.position || "Unspecified",
            }));
    };

    const team1Players = getTeamPlayers(1);
    const team2Players = getTeamPlayers(2);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1 p-0">
                    <UsersRound className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit" align="end" alignOffset={-20}>
                {team1Players.length > 0 && team2Players.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1">
                        <div className="pr-1 border-r border-slate-200 dark:border-slate-800">
                            <h3 className="font-bold mb-2">
                                Team 1 ({team1Players.length} players)
                            </h3>
                            {team1Players.map((player) => (
                                <div
                                    key={player.userId}
                                    className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2 mb-2 rounded shadow"
                                >
                                    <span className="text-sm">
                                        {player.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">
                                Team 2 ({team2Players.length} players)
                            </h3>
                            {team2Players.map((player) => (
                                <div
                                    key={player.userId}
                                    className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-2 mb-2 rounded shadow"
                                >
                                    <span className="text-sm">
                                        {player.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <span className="text-sm">No teams found</span>
                )}
            </PopoverContent>
        </Popover>
    );
}
