import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { AddLand } from "./components/AddLand";
import { LandList } from "./components/LandList";
import { LandDetail } from "./components/LandDetail";
import { QRCodeView } from "./components/QRCodeView";
import { ExportData } from "./components/ExportData";
import { AuthGuard } from "./components/AuthGuard";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { About } from "./components/About";
import { AccessGateway } from "./components/AccessGateway";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardOverview } from "./components/DashboardOverview";

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
        element: <AuthGuard><DashboardLayout /></AuthGuard>,
        children: [
          { index: true, Component: DashboardOverview },
          { path: "lands", Component: LandList },
          { path: "add-land", Component: AddLand },
          { path: "export", Component: ExportData },
          { path: "land/:id", Component: LandDetail },
          { path: "land/:id/qr", Component: QRCodeView },
        ]
      },
    ],
  },
]);