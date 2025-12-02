import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { motion } from "framer-motion";
import { Zap, Activity, Dumbbell, Flower, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Training, trainingService } from "../services/training";
import { useNavigate } from "react-router-dom";

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

export function Catalog() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const data = await trainingService.getCatalog();
        setTrainings(data);
      } catch (error) {
        console.error("Erro ao buscar catálogo", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  const getIconAndColor = (index: number) => {
    const icons = [
      { color: "bg-neo-pink", icon: <Dumbbell className="w-6 h-6" /> },
      { color: "bg-neo-green", icon: <Zap className="w-6 h-6" /> },
      { color: "bg-neo-blue", icon: <Activity className="w-6 h-6" /> },
      { color: "bg-neo-orange", icon: <Flower className="w-6 h-6" /> },
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-heading">CATÁLOGO DE TREINOS</h1>
        <Button variant="outline">FILTRAR</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {trainings.map((treino, index) => {
            const { color, icon } = getIconAndColor(index);
            return (
              <motion.div key={treino.id} variants={item}>
                <Card className="bg-white hover:shadow-neo-lg transition-all duration-300 h-full flex flex-col">
                  <div
                    className={`h-4 w-full ${color} border-b-3 border-black rounded-t-sm`}
                  />
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{treino.titulo}</CardTitle>
                      {icon}
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">
                      ID Instrutor: {treino.id_professor}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm">{treino.descricao}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-2xl font-heading">
                      R$ {Number(treino.preco).toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(`/checkout/${treino.id}`, {
                          state: { training: treino },
                        })
                      }
                    >
                      COMPRAR
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
