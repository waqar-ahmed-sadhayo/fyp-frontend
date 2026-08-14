import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardShell() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}
