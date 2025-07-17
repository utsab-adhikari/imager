"use client";
import DashboardLanding from "@/projectcomponents/Authenticated";
import Unauthenticated from "@/projectcomponents/Unauthenticated";
import { useSession } from "next-auth/react";

export default function ProjectsPage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <span className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Unauthenticated />;
  }

  if (status === "authenticated") {
    return <DashboardLanding />;
  }

  return null; 
}
