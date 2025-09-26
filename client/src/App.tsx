import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Legislacao from "@/pages/Legislacao";
import Publicacoes from "@/pages/Publicacoes";
import Eventos from "@/pages/Eventos";
import Galeria from "@/pages/Galeria";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quem-somos" component={Home} />
      <Route path="/legislacao" component={Legislacao} />
      <Route path="/publicacoes" component={Publicacoes} />
      <Route path="/eventos" component={Eventos} />
      <Route path="/galeria" component={Galeria} />
      <Route path="/contactos" component={Home} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
