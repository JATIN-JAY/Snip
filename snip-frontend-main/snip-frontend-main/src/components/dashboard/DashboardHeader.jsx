import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as LinkIcon, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function DashboardHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Loading...", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ 
          name: payload.name || "User", 
          email: payload.email || "" 
        });
      } catch (e) {
        console.error("Failed to decode token");
        setUser({ name: "User", email: "user@snip.app" });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const getInitials = (name) => {
    if (!name || name.trim() === "") return "U";
    const words = name.trim().split(" ").filter(Boolean);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-[999] w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto flex h-14 items-center justify-between px-6">
        
        <div className="flex items-center">
          <RouterLink to="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <div className="bg-orange-600 p-1 rounded-lg transition-transform group-hover:-rotate-12 shadow-sm shadow-orange-200">
              <LinkIcon className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[18px] tracking-tight text-slate-900">
              Snip
            </span>
          </RouterLink>
          
          <svg
            className="w-4 h-4 mx-2 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          
          <span className="font-medium text-[14px] text-slate-600 bg-slate-100/50 px-2 py-0.5 rounded-md">
            Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-slate-200 hover:ring-orange-200 hover:shadow-sm transition-all">
                <AvatarFallback className="bg-slate-50 text-slate-700 text-[13px] font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 mt-1 border-slate-200 shadow-xl rounded-xl z-[9999] bg-white relative">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-[14px] font-medium leading-none text-slate-900">
                    {user.name}
                  </p>
                  <p className="text-[12px] leading-none text-slate-500">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-[13px] text-red-600 focus:bg-red-50 focus:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}