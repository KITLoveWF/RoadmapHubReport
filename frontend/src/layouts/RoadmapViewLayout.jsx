import { Outlet } from "react-router-dom"
import { useEffect } from "react";
import NavBar from "#components/Home/NavBar.jsx"

const NAVBAR_HEIGHT = 80;

export default function RoadmapViewLayout(){
   useEffect(() => {
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "auto";
  return () => {
    document.body.style.overflow = previousOverflow || "";
  };
  }, []);
  return(
  <div className="d-flex flex-column" style={{ height: "100vh", overflowY: "auto" }}>
      <NavBar />
      <div style={{ height: `${NAVBAR_HEIGHT}px`, flexShrink: 0 }} aria-hidden="true" />
      <main
        className="flex-fill container-fluid px-0"
        style={{ minHeight: 0 }}
      >
        <Outlet />
      </main>
  </div>
  )
}