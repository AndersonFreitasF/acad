import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Zap, LayoutDashboard } from "lucide-react";
import { authService } from "../services/auth";
import { useEffect, useState } from "react";

export function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-20 -left-20 w-72 h-72 bg-neo-yellow rounded-full blur-3xl -z-10 opacity-30"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-20 -right-20 w-96 h-96 bg-neo-purple rounded-full blur-3xl -z-10 opacity-30"
      />

      <div className="text-center space-y-8 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-6xl md:text-8xl font-heading leading-[0.9] drop-shadow-none text-black dark:text-white"
        >
          ULTRAPASSE <span className="text-neo-blue">LIMITES</span>
          <br />
          QUEBRE <span className="text-neo-purple">RECORDS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl md:text-2xl text-black dark:text-white max-w-xl mx-auto"
        >
          Projeto de academia concluido!
        </motion.p>

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
                className="w-full sm:w-auto text-lg px-12 bg-neo-blue text-white hover:bg-neo-blue/90"
              >
                IR PARA O DASHBOARD <LayoutDashboard className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-12 bg-neo-green text-black hover:bg-neo-green/90"
                >
                  LOGIN <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-12 border-3"
                >
                  CADASTRAR <Zap className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
