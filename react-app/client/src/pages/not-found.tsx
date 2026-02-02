import { HPHCard, HPHButton } from "@/components/ui/hph";
import { AlertCircleIcon as AlertCircle, Home01Icon as Home } from "hugeicons-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <HPHCard className="w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center animate-bounce">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">404 - Página Não Encontrada</h1>
          
          <p className="text-muted-foreground mb-8">
            Desculpe, a página que procura não existe ou foi movida.
          </p>

          <Link href="/">
            <HPHButton className="w-full py-6 text-lg font-bold">
              <Home className="w-5 h-5 mr-2" />
              Voltar para o Início
            </HPHButton>
          </Link>
        </div>
      </HPHCard>
    </div>
  );
}
