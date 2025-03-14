import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
    return (
<div className="flex">
        <Sidebar />

      <main className="flex-grow p-12">
        {children}
      </main>
    </div>    );
}