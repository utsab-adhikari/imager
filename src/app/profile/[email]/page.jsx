import ProfilePage from "./ProfilePage";


const Page = async ({ params }) => {
  const { email } = await params;
  return <ProfilePage email={email} />;
};

export default Page;
