import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const navigate = useNavigate();
  const userInitials = user.email?.slice(0, 2).toUpperCase() || "U";
  const userImage = user.user_metadata.avatar_url;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-9 w-9 ring-2 ring-[#1E4959] hover:ring-[#DBD2A4] transition-colors">
          <AvatarImage src={userImage} />
          <AvatarFallback className="bg-[#1E4959]/20 backdrop-blur-sm text-white">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-black/80 backdrop-blur-sm border-[#1E4959]/30"
      >
        <DropdownMenuItem
          className="cursor-pointer flex items-center text-white hover:bg-[#1E4959]/50"
          onClick={() => navigate("/profile")}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          Profil
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#1E4959]/30" />
        <DropdownMenuItem
          className="cursor-pointer flex items-center text-white hover:bg-[#1E4959]/50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Abmelden
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
