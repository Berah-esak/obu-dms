import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import DashboardLayout from "@/components/DashboardLayout";
import { PublicOnly, RequireAuth, RequireRole } from "@/components/RouteGuards";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import RoomsPage from "@/pages/RoomsPage";
import StudentsPage from "@/pages/StudentsPage";
import MaintenancePage from "@/pages/MaintenancePage";
import RoomChangesPage from "@/pages/RoomChangesPage";
import InventoryPage from "@/pages/InventoryPage";
import ReportsPage from "@/pages/ReportsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import UserManagementPage from "@/pages/UserManagementPage";
import AuditLogsPage from "@/pages/AuditLogsPage";
import ProfilePage from "@/pages/ProfilePage";
import LandingPage from "@/pages/LandingPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
              <Route path="/forgot-password" element={<PublicOnly><ForgotPasswordPage /></PublicOnly>} />
              <Route path="/reset-password" element={<PublicOnly><ResetPasswordPage /></PublicOnly>} />
              <Route path="/" element={<LandingPage />} />
              <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/rooms" element={<RequireRole roles={["dorm_admin", "management", "system_admin"]}><RoomsPage /></RequireRole>} />
                <Route path="/students" element={<RequireRole roles={["dorm_admin", "management", "system_admin"]}><StudentsPage /></RequireRole>} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/room-changes" element={<RoomChangesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/inventory" element={<RequireRole roles={["dorm_admin", "system_admin"]}><InventoryPage /></RequireRole>} />
                <Route path="/reports" element={<RequireRole roles={["dorm_admin", "management", "system_admin"]}><ReportsPage /></RequireRole>} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/users" element={<RequireRole roles={["system_admin"]}><UserManagementPage /></RequireRole>} />
                <Route path="/audit-logs" element={<RequireRole roles={["system_admin"]}><AuditLogsPage /></RequireRole>} />
                <Route path="/settings" element={<RequireRole roles={["system_admin"]}><SettingsPage /></RequireRole>} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
