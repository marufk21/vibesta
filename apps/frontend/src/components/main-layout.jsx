import { Outlet, useNavigate } from 'react-router-dom';
import LeftSidebar from './left-sidebar';
import MobileNav from './mobile-nav';
import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

const MainLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop fixed sidebar (only on lg+ screens) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-background lg:block">
        <LeftSidebar />
      </aside>

      {/* Mobile top bar - logo left, message button right (like Instagram) */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <span
          className="cursor-pointer text-xl font-bold tracking-tight"
          onClick={() => navigate('/')}
        >
          Vibesta
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/chat')}
          aria-label="Messages"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      </header>

      {/* Content */}
      <main className="lg:pl-64">
        <Outlet />
      </main>

      {/* Mobile bottom nav (only on <lg screens) */}
      <MobileNav />
    </div>
  );
};

export default MainLayout;
