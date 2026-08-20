import Feed from './feed';
import { Outlet } from 'react-router-dom';
import RightSidebar from './right-sidebar';
import useGetAllPost from '@/hooks/use-get-all-post';
import useGetSuggestedUsers from '@/hooks/use-get-suggested-users';

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className="flex justify-center gap-6 px-4 py-4 md:px-8 xl:gap-12">
      <div className="w-full min-w-0 max-w-[580px] pb-8">
        <Feed />
        <Outlet />
      </div>
      <div className="hidden w-80 shrink-0 lg:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
