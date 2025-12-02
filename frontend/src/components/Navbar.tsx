import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Moon, Sun, LogOut, Menu, X, Dumbbell, User, ChevronDown, Settings } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { authService, AUTH_CHANGE_EVENT } from "../services/auth";
import { User as UserType } from "../services/user";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }

    checkAuth();
    // Listen for custom auth events (same tab) and storage events (other tabs)
    window.addEventListener(AUTH_CHANGE_EVENT, checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    setProfileDropdownOpen(false);
    navigate("/");
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "ADM": return "Administrador";
      case "PROFESSOR": return "Professor";
      case "ALUNO": return "Aluno";
      default: return tipo;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "ADM": return "bg-neo-pink";
      case "PROFESSOR": return "bg-neo-purple text-white";
      case "ALUNO": return "bg-neo-blue text-white";
      default: return "bg-gray-500";
    }
  };

  return (
    <nav className="border-b-4 border-black dark:border-white bg-neo-yellow dark:bg-neo-dark py-4 px-6 md:px-12 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="w-12 h-12 bg-black dark:bg-white rounded-base border-4 border-black dark:border-white flex items-center justify-center shadow-neo group-hover:shadow-neo-hover group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-all">
            <Dumbbell className="w-6 h-6 text-neo-yellow dark:text-neo-dark" />
          </div>
          <span className="text-2xl md:text-3xl font-heading uppercase tracking-tighter text-black dark:text-white">
            NEO GYM
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-4 font-bold text-sm">
            <Link
              to="/catalog"
              className="px-4 py-2 bg-white dark:bg-gray-800 border-3 border-black dark:border-white rounded-base shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase"
            >
              CATALOGO
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-neo-blue text-white border-3 border-black rounded-base shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase"
              >
                DASHBOARD
              </Link>
            )}

            {isAuthenticated && user?.tipo === "ADM" && (
              <>
                <Link
                  to="/users"
                  className="px-4 py-2 bg-neo-pink text-black border-3 border-black rounded-base shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase"
                >
                  USUARIOS
                </Link>
                <Link
                  to="/professors"
                  className="px-4 py-2 bg-neo-purple text-white border-3 border-black rounded-base shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase"
                >
                  PROFESSORES
                </Link>
              </>
            )}

            {isAuthenticated && user?.tipo === "PROFESSOR" && (
              <>
                <Link
                  to="/exercises"
                  className="px-4 py-2 bg-neo-orange text-black border-3 border-black rounded-base shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase"
                >
                  EXERCICIOS
                </Link>
                <Link
                  to="/trainings"
                  className="px-4 py-2 bg-neo-green text-black border-3 border-black rounded-base shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all uppercase"
                >
                  TREINOS
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-base border-3 border-black dark:border-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold rounded-base border-3 border-black dark:border-white shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden xl:inline">{user?.nome?.split(" ")[0]?.toUpperCase() || "USER"}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-base shadow-neo-lg z-50"
                    >
                      {/* User Info */}
                      <div className="p-4 border-b-4 border-black dark:border-white">
                        <p className="font-heading text-lg truncate">{user?.nome || "Usuario"}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
                        <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-base border-2 border-black ${getTipoColor(user?.tipo || "")}`}>
                          {getTipoLabel(user?.tipo || "")}
                        </span>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-base hover:bg-gray-100 dark:hover:bg-gray-800 font-bold transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                          Editar Perfil
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-base hover:bg-neo-red/10 text-neo-red font-bold transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          Sair da Conta
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-3 border-black dark:border-white font-bold shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] bg-white dark:bg-gray-800"
                  >
                    LOGIN
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-neo-green text-black border-3 border-black font-bold shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-neo-green"
                  >
                    CADASTRAR
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 border-3 border-black dark:border-white rounded-base bg-white dark:bg-gray-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 border-t-4 border-black dark:border-white pt-4"
          >
            <div className="flex flex-col gap-3">
              {/* User Info Mobile */}
              {isAuthenticated && (
                <div className="p-4 bg-white dark:bg-gray-800 border-3 border-black dark:border-white rounded-base mb-2">
                  <p className="font-heading text-lg">{user?.nome || "Usuario"}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                  <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-base border-2 border-black ${getTipoColor(user?.tipo || "")}`}>
                    {getTipoLabel(user?.tipo || "")}
                  </span>
                </div>
              )}

              <Link
                to="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 bg-white dark:bg-gray-800 border-3 border-black dark:border-white rounded-base shadow-neo-sm font-bold text-center"
              >
                CATALOGO
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 bg-neo-blue text-white border-3 border-black rounded-base shadow-neo-sm font-bold text-center"
                  >
                    DASHBOARD
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border-3 border-black dark:border-white rounded-base shadow-neo-sm font-bold text-center flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    EDITAR PERFIL
                  </Link>
                </>
              )}

              {isAuthenticated && user?.tipo === "ADM" && (
                <>
                  <Link
                    to="/users"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 bg-neo-pink text-black border-3 border-black rounded-base shadow-neo-sm font-bold text-center"
                  >
                    USUARIOS
                  </Link>
                  <Link
                    to="/professors"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 bg-neo-purple text-white border-3 border-black rounded-base shadow-neo-sm font-bold text-center"
                  >
                    PROFESSORES
                  </Link>
                </>
              )}

              {isAuthenticated && user?.tipo === "PROFESSOR" && (
                <>
                  <Link
                    to="/exercises"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 bg-neo-orange text-black border-3 border-black rounded-base shadow-neo-sm font-bold text-center"
                  >
                    EXERCICIOS
                  </Link>
                  <Link
                    to="/trainings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 bg-neo-green text-black border-3 border-black rounded-base shadow-neo-sm font-bold text-center"
                  >
                    TREINOS
                  </Link>
                </>
              )}

              <div className="flex gap-3 mt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="flex-1 h-12 rounded-base border-3 border-black dark:border-white bg-white dark:bg-gray-800"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                {isAuthenticated ? (
                  <Button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 h-12 gap-2 border-3 border-black font-bold bg-neo-red text-white hover:bg-neo-red/90"
                  >
                    <LogOut className="h-4 w-4" />
                    SAIR
                  </Button>
                ) : (
                  <>
                    <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-12 border-3 border-black font-bold">
                        LOGIN
                      </Button>
                    </Link>
                    <Link to="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full h-12 bg-neo-green text-black border-3 border-black font-bold hover:bg-neo-green">
                        CADASTRAR
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
