import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { dashboardOwner } from "./dashboardData";

function Fixture() {
  const [mounted, setMounted] = useState(true);
  return <>
    <button onClick={() => setMounted(false)}>Unmount dashboard</button>
    {mounted ? <DashboardClient userId={dashboardOwner} /> : <p>Unmounted</p>}
  </>;
}
createRoot(document.getElementById("root")!).render(<Fixture />);
