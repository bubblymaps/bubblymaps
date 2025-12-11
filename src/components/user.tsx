import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function User() {
    const { data: session } = useSession();
    const router = useRouter();
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className="cursor-pointer h-10 w-10 rounded-full border border-input shadow-md bg-white dark:bg-zinc-900/80 dark:backdrop-blur-sm flex items-center justify-center p-0">
                <img
                    src={session?.user?.image || "https://ui-avatars.com/api/?name=User"}
                    alt={session?.user?.name || "Avatar"}
                    className="h-8 w-8 rounded-full object-cover"
                />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile/" + (session?.user?.name || "user"))}>My Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/myaccount")}>My Account</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })}>Logout</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/terms")}>Terms of Service</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/privacy")}>Privacy Policy</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("https://github.com/bubblymaps/maps")}>GitHub</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    )
}