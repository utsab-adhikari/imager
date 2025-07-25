"use client";
import Authenticated from "@/components/General/Authenticated";
import Loader from "@/components/General/Loader";
import Unauthenticated from "@/components/General/Unauthenticated";
import Uploader from "@/ImageComponents/Uploader";
import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  const {status} = useSession();

  if(status === "loading") {
    return <Loader/>
  }

  if(status === "unauthenticated") {
    return <Unauthenticated/>
  }
  if(status === "authenticated") {
    return <Authenticated/>
  }
};

export default page;
