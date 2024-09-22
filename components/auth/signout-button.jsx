import { signOut } from "@/auth";

export function SignOut() {
    return (
        <form
            action={async () => {
                "use server";
                await signOut();
            }}
        >
            <button className="text-sm font-medium hover:underline underline-offset-4" type="submit">Sign Out</button>
        </form>
    );
}
