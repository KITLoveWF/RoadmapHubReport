import { Outlet, useLocation } from "react-router-dom"
import NavBar from "#components/Home/NavBar.jsx"
export default function NavbarLayout(){
    const location = useLocation();
    const isProfilePage = location.pathname === '/profile';
    
    return(
    <div className="d-flex flex-column" style={isProfilePage ? {height: 'auto', minHeight: 'auto'} : {minHeight: '100vh'}}>
            <NavBar />
            {isProfilePage ? (
                <Outlet />
            ) : (
                <main className="flex-fill container my-4">
                    <Outlet />
                </main>
            )}
    </div>
    )
}