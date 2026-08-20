import Feed from './feed';
import { Outlet } from 'react-router-dom';
import RightSidebar from './right-sidebar';
import useGetAllPost from '@/hooks/use-get-all-post';
import useGetSuggestedUsers from '@/hooks/use-get-suggested-users';

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className="flex justify-center">
      <div className="w-full min-w-0 max-w-xl pb-8">
        <Feed />
        <Outlet />
      </div>
      <div className="hidden w-full max-w-sm shrink-0 pl-8 pr-4 xl:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
