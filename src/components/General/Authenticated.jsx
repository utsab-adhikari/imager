import Family from "@/familycomponents/Family";
import { useSession } from "next-auth/react";
import React from "react";
const Authenticated = () => {
  const { data: session } = useSession();

  if (session && session.user.family) {
    return <Family/>;
  }

  return (
    <>
      <div>
        <h1 className="text-white">Authenticated</h1>
      </div>
    </>
  );
};

export default Authenticated;
