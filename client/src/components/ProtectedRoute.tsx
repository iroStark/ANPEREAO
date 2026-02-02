import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const anpereLogo = "/favicon.png";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Handle redirect to login when not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !fallback) {
      setLocation("/admin/login");
    }
  }, [isLoading, isAuthenticated, fallback, setLocation]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Card className="p-8">
            <CardContent className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-8 h-8 text-primary" />
              </motion.div>
              <p className="text-muted-foreground">A verificar autenticação...</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show fallback if provided and not authenticated
  if (!isAuthenticated && fallback) {
    return <>{fallback}</>;
  }

  // Show access denied message if not authenticated and no fallback
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="p-8">
            <CardContent className="flex flex-col items-center gap-4">
              <img 
                src={anpereLogo} 
                alt="ANPERE Logo" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h2 className="text-lg font-semibold mb-2">Acesso Restrito</h2>
                <p className="text-muted-foreground mb-4">
                  É necessário fazer login para aceder a esta área.
                </p>
                <p className="text-sm text-muted-foreground">
                  A redirecionar para a página de login...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;