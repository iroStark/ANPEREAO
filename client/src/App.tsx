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
import Organigrama from "@/pages/Organigrama";
import OrgaosSociais from "@/pages/OrgaosSociais";
import OrgaoSocialDetalhes from "@/pages/OrgaoSocialDetalhes";
import MemberRegistration from "@/pages/MemberRegistration";
import PoliticaPrivacidade from "@/pages/PoliticaPrivacidade";
import TermosCondicoes from "@/pages/TermosCondicoes";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminAbout from "@/pages/admin/AdminAbout";
import AdminLegislation from "@/pages/admin/AdminLegislation";
import AdminPublications from "@/pages/admin/AdminPublications";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminGallery from "@/pages/admin/AdminGallery";
import AdminSlideshow from "@/pages/admin/AdminSlideshow";
import AdminActivityPlan from "@/pages/admin/AdminActivityPlan";
import AdminContactMessages from "@/pages/admin/AdminContactMessages";
import PlanoAtividades from "@/pages/PlanoAtividades";
import Estatutos from "@/pages/Estatutos";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminMembers from "@/pages/admin/AdminMembers";
import AdminReports from "@/pages/admin/AdminReports";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminOrgaosSociais from "@/pages/admin/AdminOrgaosSociais";
import { AdminDesignTest } from "@/pages/admin/AdminDesignTest";
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
      <Route path="/plano-atividades" component={PlanoAtividades} />
      <Route path="/estatutos" component={Estatutos} />
      <Route path="/eventos" component={Eventos} />
      <Route path="/galeria" component={Galeria} />
      <Route path="/orgaos-sociais" component={OrgaosSociais} />
      <Route path="/orgaos-sociais/:id" component={OrgaoSocialDetalhes} />
      <Route path="/organigrama" component={OrgaosSociais} />
      <Route path="/contactos" component={Home} />
      <Route path="/associar-se" component={MemberRegistration} />
      <Route path="/politica-privacidade" component={PoliticaPrivacidade} />
      <Route path="/termos-condicoes" component={TermosCondicoes} />
      
      {/* Admin routes */}
      <Route path="/admin/design-test" component={() => (
        <ProtectedRoute>
          <AdminDesignTest />
        </ProtectedRoute>
      )} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={() => (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      )} />
      <Route path="/admin/dashboard" component={() => (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      )} />
      <Route path="/admin/about" component={() => (
        <ProtectedRoute>
          <AdminAbout />
        </ProtectedRoute>
      )} />
      <Route path="/admin/legislation" component={() => (
        <ProtectedRoute>
          <AdminLegislation />
        </ProtectedRoute>
      )} />
      <Route path="/admin/publications" component={() => (
        <ProtectedRoute>
          <AdminPublications />
        </ProtectedRoute>
      )} />
      <Route path="/admin/events" component={() => (
        <ProtectedRoute>
          <AdminEvents />
        </ProtectedRoute>
      )} />
      <Route path="/admin/gallery" component={() => (
        <ProtectedRoute>
          <AdminGallery />
        </ProtectedRoute>
      )} />
      <Route path="/admin/slideshow" component={() => (
        <ProtectedRoute>
          <AdminSlideshow />
        </ProtectedRoute>
      )} />
      <Route path="/admin/activity-plan" component={() => (
        <ProtectedRoute>
          <AdminActivityPlan />
        </ProtectedRoute>
      )} />
      <Route path="/admin/contact-messages" component={() => (
        <ProtectedRoute>
          <AdminContactMessages />
        </ProtectedRoute>
      )} />
      <Route path="/admin/users" component={() => (
        <ProtectedRoute>
          <AdminUsers />
        </ProtectedRoute>
      )} />
      <Route path="/admin/members" component={() => (
        <ProtectedRoute>
          <AdminMembers />
        </ProtectedRoute>
      )} />
      <Route path="/admin/reports" component={() => (
        <ProtectedRoute>
          <AdminReports />
        </ProtectedRoute>
      )} />
      <Route path="/admin/settings" component={() => (
        <ProtectedRoute>
          <AdminSettings />
        </ProtectedRoute>
      )} />
      <Route path="/admin/orgaos-sociais" component={() => (
        <ProtectedRoute>
          <AdminOrgaosSociais />
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
