import { Outlet } from "react-router-dom"
import { useEffect } from "react";
import NavBar from "#components/Home/NavBar.jsx"

const NAVBAR_HEIGHT = 80;

export default function RoadmapLayout(){
   useEffect(() => {
  // disable scroll khi vào trang này
  document.body.style.overflow = "hidden";

  return () => {
    // reset lại khi thoát khỏi layout này
    document.body.style.overflow = "auto";
  };
  }, []);
  return(
  <div className="d-flex flex-column" style={{ height: "100vh", overflow: "hidden" }}>
      <NavBar />
      <div style={{ height: `${NAVBAR_HEIGHT}px`, flexShrink: 0 }} aria-hidden="true" />
      <main
        className="flex-fill container-fluid px-0"
        style={{ overflow: "hidden", minHeight: 0 }}
      >
        <Outlet />
      </main>
  </div>
  )
}