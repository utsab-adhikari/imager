import CreateAlbum from "@/components/General/AlbumCreator";
import AlbumPage from "@/components/General/AlbumPage";
import React from "react";

export const metadata = {
  title: "Authenticated",
  description: "Page for unauthenticated access",
};

const Family = () => {
  return <div>Family

    <AlbumPage/>


<div>
  <CreateAlbum/>
</div>

  </div>;
};

export default Family;
