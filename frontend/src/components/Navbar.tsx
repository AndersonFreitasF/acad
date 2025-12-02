import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Moon, Sun, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "../services/auth";
import { User } from "../services/user";

export function Navbar() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const checkAuth = () => {
    const isAuth = authService.isAuthenticated();
    setIsAuthenticated(isAuth);
    if (isAuth) {
      setUser(authService.getUser());
    } else {
      setUser(null);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="border-b-3 border-black dark:border-gray-700 bg-white dark:bg-neo-dark py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-heading uppercase tracking-tighter hover:text-neo-blue transition-colors"
      >
        NEO GYM
      </Link>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-6 font-bold text-sm">
          <Link
            to="/catalog"
            className="hover:underline decoration-2 underline-offset-4"
          >
            CATÁLOGO
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="hover:underline decoration-2 underline-offset-4"
            >
              DASHBOARD
            </Link>
          )}

          {isAuthenticated && user?.tipo === "ADM" && (
            <>
              <Link
                to="/users"
                className="hover:underline decoration-2 underline-offset-4 text-neo-blue"
              >
                USUÁRIOS
              </Link>
              <Link
                to="/professors"
                className="hover:underline decoration-2 underline-offset-4 text-neo-purple"
              >
                PROFESSORES
              </Link>
            </>
          )}

          {isAuthenticated && user?.tipo === "PROFESSOR" && (
            <>
              <Link
                to="/exercises"
                className="hover:underline decoration-2 underline-offset-4 text-neo-pink"
              >
                EXERCÍCIOS
              </Link>
              <Link
                to="/trainings"
                className="hover:underline decoration-2 underline-offset-4 text-neo-blue"
              >
                TREINOS
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block text-sm font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                {user?.nome?.split(" ")[0]}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                SAIR
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:inline-flex"
                >
                  LOGIN
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-neo-blue text-white">
                  CADASTRAR
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
