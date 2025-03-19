import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
    return (
      <div className="flex h-screen overflow-hidden">
        
        <Sidebar />
        <main className="flex-grow p-8 md:p-12 overflow-auto">{children}</main>
      </div>
    );
}