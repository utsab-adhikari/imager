
import ProfileUpdatePage from "./ProfileUpdatePage";


const Page = async ({ params }) => {
  const { email } = await params;
  return <ProfileUpdatePage email={email} />;
};

export default Page;
