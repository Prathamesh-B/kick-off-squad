import { signIn } from "@/auth";

export function SignIn() {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
            }}
        >
            <button className="text-sm font-medium hover:underline underline-offset-4" type="submit">Sign in</button>
        </form>
    );
}
