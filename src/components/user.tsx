import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function User() {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    return (
        <>
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
            { session?.user.moderator && (
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/mod")}>Mod Panel</DropdownMenuItem>
            )}
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer" onSelect={e => e.preventDefault()}>Logout</DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be signed out and redirected to the homepage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white dark:bg-blue-600 dark:hover:bg-blue-500">Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/terms")}>Terms of Service</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/privacy")}>Privacy Policy</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("https://github.com/bubblymaps/maps")}>GitHub</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    </>
    )
}