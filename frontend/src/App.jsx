import { useState } from "react";
import {
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import HomeLayout from "#layouts/HomeLayout.jsx";
import NavbarLayout from "#layouts/NavbarLayout.jsx";
import RoadmapLayout from "#layouts/RoadmapLayout.jsx";
import SignUp from "#pages/SignUp/SignUp.jsx";
import VerifyEmail from "#pages/SignUp/VerifyEmail.jsx";
import Login from "#pages/Login/loginPage/Login.jsx";
import LoginVerify from "#pages/Login/LoginVerify/LoginVerify.jsx";
import ForgotPassword from "#pages/ForgotPassword/ForgotPassword/forgotPassword.jsx";
import ResetPassword from "./pages/ForgotPassword/ResetPassword/ResetPassword";
import RefreshToken from "#pages/Login/RefreshTokenPage/RefreshToken.jsx";
import RoadmapEditPage from "#pages/Roadmap/RoadmapEditPage/RoadmapEditPage.jsx";
import PrivacyPolicy from "#pages/Introduction/PrivacyPolicy/PrivacyPolicy.jsx";
import TermsService from "#pages/Introduction/TermsService/TermsService.jsx";
import ContactUs from "#pages/Introduction/ContactUs/ContactUs.jsx";
import About from "#/pages/Introduction/About/About.jsx";
import FAQs from "#/pages/Introduction/FAQs/FAQs.jsx";
import Guides from "#pages/Introduction/Guides/Guides.jsx";
import Youtube from "#/pages/Introduction/Youtube/Youtube.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage/ProfilePage.jsx";
import RoadmapView from "#pages/Roadmap/RoadmapView/RoadmapView.jsx";
import Home from "#pages/Home/Home.jsx";
import ChangeEmailVerify from "#pages/ChangeEmailVerify/ChangeEmailVerify.jsx";
import VerifyDeletePage from "#pages/ProfilePage/VerifyDeletePage/VerifyDeletePage.jsx";
import RoadmapViewLayout from "#layouts/RoadmapViewLayout.jsx";
import RoadmapSearchPage from "#pages/Roadmap/RoadmapSearchPage/RoadmapSearchPage.jsx";
import ClassroomView from "#/pages/Classroom/ClassromView.jsx";
import StudentClassroomView from "#pages/StudentClassroom/StudentClassroomView.jsx";
import GoogleOAuth2Callback from "#pages/Auth/GoogleOAuth2Callback.jsx";
import EmailVerifySuccess from "#pages/Auth/EmailVerifySuccess.jsx";
import AdminLayout from "#layouts/AdminLayout.jsx";
import AdminLogin from "#pages/Admin/AdminLogin/AdminLogin.jsx";
import AdminDashboard from "#pages/Admin/AdminDashboard/AdminDashboard.jsx";
import UserManagement from "#pages/Admin/UserManagement/UserManagement.jsx";
import RoadmapManagement from "#pages/Admin/RoadmapManagement/RoadmapManagement.jsx";
import ManageTeamsPage from "#pages/Team/ManageTeamsPage/ManageTeamsPage.jsx";
import TeamPage from "#pages/Team/TeamPage/TeamPage.jsx";
function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "about", element: <About /> },
          { path: "privacy-policy", element: <PrivacyPolicy /> },
          { path: "terms-of-service", element: <TermsService /> },
          { path: "contact-us", element: <ContactUs /> },
          { path: "faqs", element: <FAQs /> },
          { path: "guides", element: <Guides /> },
          { path: "youtube", element: <Youtube /> },
          { path: "verify/:email", element: <VerifyEmail /> },
          { path: "login/verify", element: <LoginVerify /> },
        ],
      },
      {
        path: "/",
        element: <NavbarLayout />,
        children: [
          { path: "search/:query", element: <RoadmapSearchPage /> },
          { path: "signup", element: <SignUp /> },
          { path: "auth/verify-success", element: <EmailVerifySuccess /> },
          { path: "login", element: <Login /> },
          { path: "auth/google/callback", element: <GoogleOAuth2Callback /> },
          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "reset-password/:token/:email", element: <ResetPassword /> },
          { path: "refresh-token", element: <RefreshToken /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "teams", element: <ManageTeamsPage /> },
          { path: "team/:teamId", element: <TeamPage /> },
          //{path:'roadmap/view/:name', element:<RoadmapView/>},
          {
            path: "change-email/verify/:hashedPin/:oldEmail/:newEmail",
            element: <ChangeEmailVerify />,
          },
          {
            path: "/delete-account/verify/:verifyToken/:email",
            element: <VerifyDeletePage />,
          },
          {
            path: "classroom/view/:name/:classroomId",
            element: <ClassroomView />,
          },
          {
            path: "classroom/view-student/:name/:classroomId",
            element: <StudentClassroomView />,
          },
        ],
      },
      {
        path: "/",
        element: <RoadmapLayout />,
        children: [
          // <<<<<<< HEAD
          //         {path:'roadmap/edit/:name', element: <RoadmapEditPage />},
          // =======
          { path: "roadmap/edit/:name/:id", element: <RoadmapEditPage /> },
          { path: "team/:teamId/roadmaps/:roadmapId/edit", element: <RoadmapEditPage /> },
        ],
      },
      {
        path: "/",
        element: <RoadmapViewLayout />,
        children: [
          { path: "roadmap/view/:roadmapId", element: <RoadmapView /> },
        ],
      },
      // Admin routes
      {
        path: "/admin/login",
        element: <AdminLogin />,
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <UserManagement /> },
          { path: "roadmaps", element: <RoadmapManagement /> },
        ],
      },
    ]
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
