import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { NotificationBell } from "../components/NotificationBell";
export function AppLayout(){return <div className="shell"><Sidebar/><main><header className="topbar"><strong>Notification Platform</strong><NotificationBell/></header><Outlet/></main></div>}
