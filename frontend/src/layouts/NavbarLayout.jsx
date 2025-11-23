import { Outlet, useLocation } from "react-router-dom"
import NavBar from "#components/Home/NavBar.jsx"
export default function NavbarLayout(){
    const location = useLocation();
    const isProfilePage = location.pathname === '/profile';
    const isClassroomPage = location.pathname.startsWith('/classroom/view/') || location.pathname.startsWith('/classroom/view-student/');
    const isSpecialLayout = isProfilePage || isClassroomPage;
    
    return(
    <div className="d-flex flex-column" style={isSpecialLayout ? {height: 'auto', minHeight: 'auto'} : {minHeight: '100vh'}}>
            <NavBar />
            {isSpecialLayout ? (
                <Outlet />
            ) : (
                <main className="flex-fill container my-4">
                    <Outlet />
                </main>
            )}
    </div>
    )
}