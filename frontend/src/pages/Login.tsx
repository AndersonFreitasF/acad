import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { authService } from "../services/auth";
import { Loader2, Dumbbell, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(
        err.response?.data?.message || "Credenciais inválidas. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-grid opacity-30 dark:opacity-10" />
      
      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-20 left-10 w-24 h-24 bg-neo-blue border-4 border-black rounded-base shadow-neo rotate-12 hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-neo-green border-4 border-black rounded-full shadow-neo hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bottom-40 left-20 w-20 h-20 bg-neo-yellow border-4 border-black shadow-neo -rotate-6 hidden lg:block"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-4 border-black dark:border-white shadow-neo-lg bg-white dark:bg-gray-900">
          <CardHeader className="space-y-4 pb-6 bg-neo-blue border-b-4 border-black dark:border-white">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-black rounded-base flex items-center justify-center shadow-neo">
                <Dumbbell className="w-8 h-8 text-neo-blue" />
              </div>
            </div>
            <CardTitle className="text-4xl font-heading text-center text-white">ENTRAR</CardTitle>
            <CardDescription className="text-center text-white/80 font-medium">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-neo-red/10 text-neo-red p-4 rounded-base border-4 border-neo-red font-bold text-sm"
                >
                  {error}
                </motion.div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold uppercase">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="border-4 border-black dark:border-white rounded-base h-12 font-medium focus:ring-4 focus:ring-neo-blue/50 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-neo transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-bold uppercase">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="border-4 border-black dark:border-white rounded-base h-12 font-medium focus:ring-4 focus:ring-neo-blue/50 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-neo transition-all"
                />
              </div>
              <Button 
                className="w-full h-14 text-lg font-bold bg-neo-green text-black border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ENTRANDO...
                  </>
                ) : (
                  <>
                    ENTRAR
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2 pb-6">
            <div className="text-sm text-center font-medium">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-neo-blue font-bold hover:underline decoration-4 underline-offset-4"
              >
                Cadastre-se aqui
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
