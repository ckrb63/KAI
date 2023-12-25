import Navigationbar from "@/components/custom/Navigationbar";
import Sidebar from "@/components/custom/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:fixed md:inset-y-0 z-[80] md:w-60 bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-60">
        <Navigationbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
