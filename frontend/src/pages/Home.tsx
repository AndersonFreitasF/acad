import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Zap, LayoutDashboard, Dumbbell, Trophy, Target } from "lucide-react";
import { authService } from "../services/auth";
import { useEffect, useState } from "react";

export function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-50 dark:opacity-20" />
      
      {/* Floating Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-20 left-10 w-32 h-32 bg-neo-yellow border-4 border-black rounded-base shadow-neo rotate-12 hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-40 right-20 w-24 h-24 bg-neo-pink border-4 border-black rounded-full shadow-neo hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute bottom-40 left-20 w-20 h-20 bg-neo-blue border-4 border-black shadow-neo hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute bottom-20 right-10 w-28 h-28 bg-neo-green border-4 border-black rounded-base shadow-neo -rotate-12 hidden lg:block"
      />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-neo-yellow border-4 border-black rounded-full shadow-neo font-bold text-sm"
          >
            <Dumbbell className="w-4 h-4" />
            SISTEMA DE ACADEMIA COMPLETO
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading leading-[0.9] text-black dark:text-white"
          >
            ULTRAPASSE{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-white dark:text-black px-4">LIMITES</span>
              <span className="absolute inset-0 bg-neo-blue border-4 border-black -rotate-1 shadow-neo" />
            </span>
            <br />
            QUEBRE{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-white dark:text-black px-4">RECORDS</span>
              <span className="absolute inset-0 bg-neo-purple border-4 border-black rotate-1 shadow-neo" />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl md:text-2xl text-black dark:text-white max-w-2xl mx-auto font-medium"
          >
            Projeto de academia concluido!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-8"
          >
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-12 py-6 bg-neo-blue text-white border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all font-bold"
                >
                  IR PARA O DASHBOARD <LayoutDashboard className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-lg px-12 py-6 bg-neo-green text-black border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all font-bold"
                  >
                    LOGIN <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-lg px-12 py-6 border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all font-bold bg-white dark:bg-gray-800"
                  >
                    CADASTRAR <Zap className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="relative z-10 border-t-4 border-black dark:border-white bg-white dark:bg-gray-900"
      >
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-neo-yellow border-4 border-black rounded-base shadow-neo">
              <div className="w-14 h-14 bg-black rounded-base flex items-center justify-center mb-4">
                <Dumbbell className="w-8 h-8 text-neo-yellow" />
              </div>
              <h3 className="text-xl font-heading mb-2">TREINOS PERSONALIZADOS</h3>
              <p className="text-sm font-medium">
                Acesse treinos criados por professores profissionais.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-neo-pink border-4 border-black rounded-base shadow-neo">
              <div className="w-14 h-14 bg-black rounded-base flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-neo-pink" />
              </div>
              <h3 className="text-xl font-heading mb-2">ACOMPANHE SEU PROGRESSO</h3>
              <p className="text-sm font-medium">
                Monitore sua evolucao e conquiste seus objetivos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-neo-blue border-4 border-black rounded-base shadow-neo text-white">
              <div className="w-14 h-14 bg-white rounded-base flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-neo-blue" />
              </div>
              <h3 className="text-xl font-heading mb-2">ALCANCE SEUS OBJETIVOS</h3>
              <p className="text-sm font-medium">
                Tenha acesso as melhores ferramentas para seu treino.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
