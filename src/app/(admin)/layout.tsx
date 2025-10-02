import { Header } from '@/components/header';
import { MainNav } from '@/components/main-nav';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DataProvider } from '@/context/data-context';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <SidebarProvider>
        <MainNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Header />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </DataProvider>
  );
}
