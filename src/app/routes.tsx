import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { AddLand } from "./components/AddLand";
import { LandList } from "./components/LandList";
import { LandDetail } from "./components/LandDetail";
import { QRCodeView } from "./components/QRCodeView";
import { ExportData } from "./components/ExportData";
import { AuthGuard } from "./components/AuthGuard";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { About } from "./components/About";
import { AccessGateway } from "./components/AccessGateway";
import { DatabasePage } from "./components/DatabasePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "access", Component: AccessGateway },
      { path: "privacy", Component: PrivacyPolicy },
      { path: "about", Component: About },
      { 
        path: "dashboard", 
        element: <AuthGuard><Dashboard /></AuthGuard> 
      },
      {
        path: "database",
        element: <AuthGuard><DatabasePage /></AuthGuard>
      },
      { 
        path: "dashboard/add-land", 
        element: <AuthGuard><AddLand /></AuthGuard> 
      },
      { 
        path: "dashboard/lands", 
        element: <AuthGuard><LandList /></AuthGuard> 
      },
      { 
        path: "dashboard/land/:id", 
        element: <AuthGuard><LandDetail /></AuthGuard> 
      },
      { 
        path: "dashboard/land/:id/qr", 
        element: <AuthGuard><QRCodeView /></AuthGuard> 
      },
      { 
        path: "dashboard/export", 
        element: <AuthGuard><ExportData /></AuthGuard> 
      },
    ],
  },
]);