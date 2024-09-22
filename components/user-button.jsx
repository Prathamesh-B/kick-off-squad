"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { User } from "lucide-react";
import { Calendar } from "lucide-react";

export default function UserButton({ user }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" className="flex-none rounded-full">
                    <Image
                        src={user.image || "/images/avatar_placeholder.png"}
                        alt="User profile picture"
                        width={50}
                        height={50}
                        className="aspect-square rounded-full bg-background object-cover"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name || "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/create-event">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Create Event</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center"
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Log Out
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
