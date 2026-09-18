import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
export function NotificationBell() { const [count,setCount]=useState(0); useEffect(()=>{api.get("/in-app-notifications/unread-count").then(r=>setCount(r.data.data.count)).catch(()=>undefined)},[]); return <button className="iconButton" title="Notifications"><Bell size={18}/>{count>0&&<span className="badge">{count}</span>}</button>; }
