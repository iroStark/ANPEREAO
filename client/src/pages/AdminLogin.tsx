import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { HPHButton, HPHCard, HPHInput } from "@/components/ui/hph";
import { Label } from "@/components/ui/label";
import { UserIcon as User, LockIcon as Lock, Login03Icon as LogIn } from "hugeicons-react";
import { useLocation } from "wouter";
const anpereLogo = "/favicon.png";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting || isLoading) {
      return;
    }

    if (!username.trim() || !password.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ username: username.trim(), password });
      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso!",
      });
      // Small delay to show success message before redirect
      setTimeout(() => {
        setLocation("/admin");
      }, 500);
    } catch (error: any) {
      toast({
        title: "Erro de Login",
        description: error.message || "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center mb-4"
          >
            <img 
              src={anpereLogo} 
              alt="ANPERE Logo" 
              className="h-20 w-auto object-contain"
            />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Administração ANPERE
          </h1>
          <p className="text-sm text-muted-foreground">
            Faça login para gerir o conteúdo do sistema
          </p>
        </div>

        {/* Login Form */}
        <HPHCard>
          <div className="p-6">
            <h2 className="text-xl font-bold text-center flex items-center justify-center gap-2 mb-6">
              <User className="w-5 h-5 text-primary" />
              Iniciar Sessão
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Utilizador</Label>
                <HPHInput
                  id="username"
                  type="text"
                  placeholder="Digite o nome de utilizador"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<User className="w-4 h-4" />}
                  disabled={isLoading}
                  data-testid="input-username"
                  autoComplete="username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Palavra-passe</Label>
                <HPHInput
                  id="password"
                  type="password"
                  placeholder="Digite a palavra-passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  disabled={isLoading}
                  data-testid="input-password"
                  autoComplete="current-password"
                />
              </div>

              <HPHButton
                type="submit"
                className="w-full gap-2"
                variant="primary"
                disabled={isLoading || isSubmitting}
                data-testid="button-login"
              >
                {(isLoading || isSubmitting) ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {(isLoading || isSubmitting) ? "A entrar..." : "Entrar"}
              </HPHButton>
            </form>
          </div>
        </HPHCard>

        {/* Development Info */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-muted/50 rounded-lg text-center"
          >
            <p className="text-xs text-muted-foreground">
              <strong>Ambiente de Desenvolvimento</strong><br />
              Utilizador: admin | Palavra-passe: admin123
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLogin;