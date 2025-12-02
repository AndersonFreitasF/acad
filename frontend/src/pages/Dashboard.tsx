import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { User } from "../services/user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dumbbell,
  Users,
  GraduationCap,
  ClipboardList,
  ShoppingBag,
  LayoutDashboard,
} from "lucide-react";

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
      icon: <Dumbbell className="w-8 h-8" />,
      path: "/my-trainings",
      roles: ["ALUNO", "PROFESSOR", "ADM"],
      color: "bg-neo-green",
    },
    {
      title: "Catálogo",
      icon: <ShoppingBag className="w-8 h-8" />,
      path: "/catalog",
      roles: ["ALUNO", "PROFESSOR", "ADM"],
      color: "bg-neo-blue",
    },
    {
      title: "Gerenciar Usuários",
      icon: <Users className="w-8 h-8" />,
      path: "/users",
      roles: ["ADM"],
      color: "bg-neo-pink",
    },
    {
      title: "Gerenciar Professores",
      icon: <GraduationCap className="w-8 h-8" />,
      path: "/professors",
      roles: ["ADM"],
      color: "bg-neo-purple",
    },
    {
      title: "Gerenciar Exercícios",
      icon: <ClipboardList className="w-8 h-8" />,
      path: "/exercises",
      roles: ["PROFESSOR"],
      color: "bg-neo-orange",
    },
    {
      title: "Gerenciar Treinos",
      icon: <LayoutDashboard className="w-8 h-8" />,
      path: "/trainings",
      roles: ["PROFESSOR"],
      color: "bg-neo-yellow",
    },
  ];

  const allowedItems = menuItems.filter((item) =>
    item.roles.includes(user.tipo)
  );

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-heading text-black dark:text-white">
          OLÁ, {user.nome.split(" ")[0].toUpperCase()}
        </h1>
        <p className="text-muted-foreground">
          O que você gostaria de fazer hoje?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allowedItems.map((item, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-neo-lg transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
            onClick={() => navigate(item.path)}
          >
            <CardHeader
              className={`${item.color} border-b-3 border-black rounded-t-base`}
            >
              <div className="text-black">{item.icon}</div>
            </CardHeader>
            <CardContent className="pt-6">
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
