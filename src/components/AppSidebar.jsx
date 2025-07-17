"use client";

import {
  Home,
  NotebookPen,
  Newspaper,
  Settings,
  UserRoundPlus,
  LogIn,
  PenSquare,
  LayoutDashboard,
} from "lucide-react";
import { IconSignRight } from "@tabler/icons-react";
import { IoMdClose } from "react-icons/io";
import { BsFillPostcardFill } from "react-icons/bs";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { GiProgression } from "react-icons/gi";

const baseMenuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Tasks", url: "/tasks", icon: Newspaper },
  { title: "Progress", url: "/progress", icon: GiProgression },
];

const userItems = [
  { title: "Login", url: "/auth/login", icon: LogIn },
  { title: "Signup", url: "/signup", icon: UserRoundPlus },
];

const utilityItems = [{ title: "Settings", url: "/settings", icon: Settings }];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* Mobile Close Button */}
          <div className="absolute top-0 right-0 p-3 md:hidden">
            <button onClick={() => toggleSidebar()}>
              <IoMdClose size={24} />
            </button>
          </div>

          <SidebarGroupLabel className="pt-6">
            🧠 Utsab's Blog App
          </SidebarGroupLabel>

          {/* Main Navigation */}
          <SidebarGroupContent>
            <SidebarMenu>
              {baseMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          {/* 👤 Auth Navigation */}
          <SidebarGroupLabel>👤 Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {!isLoggedIn &&
                userItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              {isLoggedIn && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded w-full"
                  >
                    <span>Log Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {isLoggedIn && session?.user && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      href={`/profile/${encodeURIComponent(
                        session.user.email
                      )}`}
                      className="flex items-center gap-2 w-full"
                    >
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover border border-white"
                      />
                      <span className="truncate">{session.user.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>

          {/* ⚙️ Settings */}
          <SidebarGroupLabel>⚙️ More</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
