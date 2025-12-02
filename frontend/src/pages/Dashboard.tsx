import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { User } from "../services/user";
import {
  Dumbbell,
  Users,
  GraduationCap,
  ClipboardList,
  ShoppingBag,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/");
      return;
    }
    setUser(authService.getUser());
  }, [navigate]);

  if (!user) return null;

  const menuItems = [
    {
      title: "Meus Treinos",
      description: "Acesse seus treinos comprados",
      icon: <Dumbbell className="w-10 h-10" />,
      path: "/my-trainings",
      roles: ["ALUNO", "PROFESSOR", "ADM"],
      color: "bg-neo-green",
      iconBg: "bg-black",
      iconColor: "text-neo-green",
    },
    {
      title: "Catálogo",
      description: "Explore treinos disponiveis",
      icon: <ShoppingBag className="w-10 h-10" />,
      path: "/catalog",
      roles: ["ALUNO", "PROFESSOR", "ADM"],
      color: "bg-neo-blue",
      iconBg: "bg-white",
      iconColor: "text-neo-blue",
      textColor: "text-white",
    },
    {
      title: "Gerenciar Usuários",
      description: "Adicione e edite usuarios",
      icon: <Users className="w-10 h-10" />,
      path: "/users",
      roles: ["ADM"],
      color: "bg-neo-pink",
      iconBg: "bg-black",
      iconColor: "text-neo-pink",
    },
    {
      title: "Gerenciar Professores",
      description: "Gerencie sua equipe",
      icon: <GraduationCap className="w-10 h-10" />,
      path: "/professors",
      roles: ["ADM"],
      color: "bg-neo-purple",
      iconBg: "bg-white",
      iconColor: "text-neo-purple",
      textColor: "text-white",
    },
    {
      title: "Gerenciar Exercícios",
      description: "Crie novos exercicios",
      icon: <ClipboardList className="w-10 h-10" />,
      path: "/exercises",
      roles: ["PROFESSOR"],
      color: "bg-neo-orange",
      iconBg: "bg-black",
      iconColor: "text-neo-orange",
    },
    {
      title: "Gerenciar Treinos",
      description: "Monte treinos personalizados",
      icon: <LayoutDashboard className="w-10 h-10" />,
      path: "/trainings",
      roles: ["PROFESSOR"],
      color: "bg-neo-yellow",
      iconBg: "bg-black",
      iconColor: "text-neo-yellow",
    },
  ];

  const allowedItems = menuItems.filter((item) =>
    item.roles.includes(user.tipo)
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-[calc(100vh-180px)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-40 dark:opacity-20" />
      
      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-10 right-10 w-20 h-20 bg-neo-yellow border-4 border-black rounded-base shadow-neo rotate-12 hidden xl:block"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute bottom-20 left-10 w-16 h-16 bg-neo-pink border-4 border-black rounded-full shadow-neo hidden xl:block"
      />

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-yellow border-4 border-black rounded-base shadow-neo-sm font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              BEM-VINDO DE VOLTA
            </div>
            <h1 className="text-5xl md:text-6xl font-heading text-black dark:text-white">
              OLÁ,{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-white dark:text-black px-3">
                  {user.nome?.split(" ")[0]?.toUpperCase() || "USER"}
                </span>
                <span className="absolute inset-0 bg-neo-blue border-4 border-black -rotate-1 shadow-neo" />
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
              O que você gostaria de fazer hoje?
            </p>
          </motion.div>

          {/* Menu Grid */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {allowedItems.map((menuItem, index) => (
              <motion.div
                key={index}
                variants={item}
                onClick={() => navigate(menuItem.path)}
                className={`${menuItem.color} border-4 border-black rounded-base shadow-neo cursor-pointer group
                  hover:shadow-neo-lg hover:translate-x-[-6px] hover:translate-y-[-6px] transition-all duration-200`}
              >
                <div className="p-6 space-y-4">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${menuItem.iconBg} rounded-base flex items-center justify-center shadow-neo-sm`}>
                    <div className={menuItem.iconColor}>
                      {menuItem.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className={`text-2xl font-heading ${menuItem.textColor || "text-black"}`}>
                      {menuItem.title}
                    </h3>
                    <p className={`text-sm font-medium ${menuItem.textColor ? "text-white/80" : "text-black/70"}`}>
                      {menuItem.description}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div className={`flex items-center gap-2 font-bold ${menuItem.textColor || "text-black"} group-hover:gap-4 transition-all`}>
                    ACESSAR
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
