import { SidebarTrigger } from '@/components/ui/sidebar';
import { GlobalSearch } from './global-search';
import { UserNav } from './user-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="relative flex-1 md:grow-0">
        <GlobalSearch />
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <UserNav />
      </div>
    </header>
  );
}
