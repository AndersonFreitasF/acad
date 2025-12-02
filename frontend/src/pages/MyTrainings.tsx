import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { Training, trainingService } from "../services/training";
import { Loader2, Dumbbell, Play, ShoppingBag, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { motion } from "framer-motion";

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getColorByIndex = (index: number) => {
    const colors = [
      { bg: "bg-neo-green", text: "text-black" },
      { bg: "bg-neo-blue", text: "text-white" },
      { bg: "bg-neo-pink", text: "text-black" },
      { bg: "bg-neo-purple", text: "text-white" },
      { bg: "bg-neo-orange", text: "text-black" },
      { bg: "bg-neo-yellow", text: "text-black" },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-[calc(100vh-180px)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-grid opacity-30 dark:opacity-10" />

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-20 right-20 w-20 h-20 bg-neo-green border-4 border-black rounded-base shadow-neo rotate-12 hidden xl:block"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute bottom-40 left-10 w-16 h-16 bg-neo-blue border-4 border-black rounded-full shadow-neo hidden xl:block"
      />

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-green border-4 border-black rounded-base shadow-neo-sm font-bold text-sm">
              <Dumbbell className="w-4 h-4" />
              MINHA BIBLIOTECA
            </div>
            <h1 className="text-5xl md:text-6xl font-heading text-black dark:text-white">
              MEUS TREINOS
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
              Acesse seus treinos comprados aqui.
            </p>
          </motion.div>

          {/* Content */}
          <section className="min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-20 h-20 bg-neo-green border-4 border-black rounded-base shadow-neo flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                <p className="font-bold text-lg">Carregando seus treinos...</p>
              </div>
            ) : myTrainings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white dark:bg-gray-900 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-base"
              >
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-base mx-auto mb-6 flex items-center justify-center border-4 border-gray-200 dark:border-gray-700">
                  <Dumbbell className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-2xl font-heading text-gray-500 mb-2">
                  Você ainda não comprou nenhum treino
                </p>
                <p className="text-gray-400 mb-6">
                  Explore nosso catálogo e encontre o treino perfeito para você
                </p>
                <Button
                  onClick={() => navigate("/catalog")}
                  className="bg-neo-blue text-white border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[-4px] hover:translate-y-[-4px] font-bold px-8 py-6 text-lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  VER CATÁLOGO
                </Button>
              </motion.div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {myTrainings.map((training, index) => {
                  const color = getColorByIndex(index);
                  return (
                    <motion.div
                      key={training.id}
                      variants={item}
                      className={`${color.bg} border-4 border-black rounded-base shadow-neo
                        hover:shadow-neo-lg hover:translate-x-[-6px] hover:translate-y-[-6px] transition-all`}
                    >
                      <div className="p-6 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-14 h-14 bg-black rounded-base flex items-center justify-center shadow-neo-sm">
                            <Dumbbell className={`w-7 h-7 ${color.bg.replace("bg-", "text-")}`} />
                          </div>
                          <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-base flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            ADQUIRIDO
                          </span>
                        </div>

                        {/* Content */}
                        <div>
                          <h3 className={`text-2xl font-heading mb-2 ${color.text}`}>
                            {training.titulo}
                          </h3>
                          <p className={`text-sm font-medium line-clamp-2 ${color.text === "text-white" ? "text-white/80" : "text-black/70"}`}>
                            {training.descricao || "Sem descrição"}
                          </p>
                        </div>

                        {/* Action */}
                        <Button
                          className="w-full bg-black text-white border-4 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] font-bold h-12"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          INICIAR TREINO
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </section>

          {/* Stats */}
          {myTrainings.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-base shadow-neo p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase text-gray-500">Total de treinos</p>
                  <p className="text-3xl font-heading text-neo-green">{myTrainings.length}</p>
                </div>
                <Button
                  onClick={() => navigate("/catalog")}
                  variant="outline"
                  className="border-4 border-black font-bold shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  COMPRAR MAIS
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
