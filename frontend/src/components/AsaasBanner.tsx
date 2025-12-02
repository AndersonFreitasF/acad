import { useState } from "react";
import { userService } from "../services/user";
import { authService } from "../services/auth";
import { Button } from "./ui/button";
import { AlertTriangle, RefreshCw, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AsaasBannerProps {
  userId: number;
  onSuccess?: () => void;
}

export function AsaasBanner({ userId, onSuccess }: AsaasBannerProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dismissed, setDismissed] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    setError("");
    
    try {
      await userService.createCustomerAsaas(userId);
      setSuccess(true);
      onSuccess?.();
      
      // Auto-dismiss after success
      setTimeout(() => {
        setDismissed(true);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Falha ao configurar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative border-4 border-black rounded-base shadow-neo overflow-hidden ${
          success ? "bg-neo-green" : "bg-neo-yellow"
        }`}
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 p-1 hover:bg-black/10 rounded-base transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 pr-12">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 flex-shrink-0 rounded-base border-3 border-black flex items-center justify-center ${
              success ? "bg-black" : "bg-white"
            }`}>
              {success ? (
                <CheckCircle className="w-6 h-6 text-neo-green" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-neo-yellow" />
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <h3 className="font-heading text-xl">
                {success ? "Sistema de Pagamentos Configurado!" : "Configurar Sistema de Pagamentos"}
              </h3>
              <p className="text-sm font-medium text-black/70">
                {success 
                  ? "Agora você pode comprar treinos normalmente."
                  : "Para comprar treinos, precisamos configurar seu perfil de pagamento. Isso leva apenas alguns segundos."
                }
              </p>
              
              {error && (
                <p className="text-sm font-bold text-neo-red">{error}</p>
              )}
              
              {!success && (
                <Button
                  onClick={handleRetry}
                  disabled={loading}
                  className="mt-2 bg-black text-white border-3 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] font-bold"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Configurando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Configurar Agora
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

