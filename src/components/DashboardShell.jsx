import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatbotWidget from "./ChatbotWidget";

export default function DashboardShell() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-content">
        <Outlet />
      </div>
      <ChatbotWidget />
    </div>
  );
}
