import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { User as UserIcon, Settings, LogOut, FileText, Shield, ShieldCheck } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
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
          <DropdownMenuLabel className="flex items-center gap-3 px-3 py-3">
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                @{session?.user?.handle} ({session?.user?.displayName})
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                {session?.user?.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/u/" + (session?.user?.name || "user"))}>
              <UserIcon className="w-4 h-4 mr-2" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer" onSelect={e => e.preventDefault()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
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
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/legal/terms")}>
              <FileText className="w-4 h-4 mr-2" />
              Terms of Service
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/legal/privacy")}>
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
            </DropdownMenuItem>
            
            { session?.user.moderator && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/manage")}>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Mod Panel
                </DropdownMenuItem>
              </>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
    </>
    )
}