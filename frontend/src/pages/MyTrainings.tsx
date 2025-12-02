import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { Training, trainingService } from "../services/training";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export function MyTrainings() {
  const navigate = useNavigate();
  const [myTrainings, setMyTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/");
      return;
    }

    const fetchMyTrainings = async () => {
      try {
        const data = await trainingService.getMyTrainings();
        setMyTrainings(data);
      } catch (error) {
        console.error("Erro ao buscar meus treinos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTrainings();
  }, [navigate]);

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-heading text-black dark:text-white">
          MEUS TREINOS
        </h1>
        <p className="text-muted-foreground">
          Acesse seus treinos comprados aqui.
        </p>
      </div>

      <section className="min-h-[300px]">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-neo-blue" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myTrainings.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-base border-3 border-dashed border-gray-300 dark:border-gray-600">
                <p className="text-xl font-bold text-gray-500 mb-4">
                  Você ainda não comprou nenhum treino.
                </p>
                <Button onClick={() => navigate("/catalog")}>
                  VER CATÁLOGO
                </Button>
              </div>
            ) : (
              myTrainings.map((training) => (
                <div
                  key={training.id}
                  className="bg-white dark:bg-gray-800 p-6 border-3 border-black dark:border-gray-600 rounded-base shadow-neo hover:shadow-neo-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-black dark:text-white">
                      {training.titulo}
                    </h3>
                    <span className="bg-neo-blue text-white text-xs px-2 py-1 rounded-sm font-bold">
                      ADQUIRIDO
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                    {training.descricao}
                  </p>
                  <Button className="w-full" variant="outline">
                    INICIAR TREINO
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
