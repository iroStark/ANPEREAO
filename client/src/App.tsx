import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import Legislacao from "@/pages/Legislacao";
import Publicacoes from "@/pages/Publicacoes";
import Eventos from "@/pages/Eventos";
import Galeria from "@/pages/Galeria";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/quem-somos" component={Home} />
      <Route path="/legislacao" component={Legislacao} />
      <Route path="/publicacoes" component={Publicacoes} />
      <Route path="/eventos" component={Eventos} />
      <Route path="/galeria" component={Galeria} />
      <Route path="/contactos" component={Home} />
      
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={() => (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      )} />
      <Route path="/admin/:section" component={() => (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      )} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
