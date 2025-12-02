import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Zap, Activity, Dumbbell, Flower, Loader2, ShoppingCart, Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { Training, trainingService } from "../services/training";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";

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
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const data = await trainingService.getCatalog();
        setTrainings(data);
        setFilteredTrainings(data);
      } catch (error) {
        console.error("Erro ao buscar catálogo", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  useEffect(() => {
    const filtered = trainings.filter((t) =>
      t.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrainings(filtered);
  }, [searchTerm, trainings]);

  const getIconAndColor = (index: number) => {
    const icons = [
      { color: "bg-neo-pink", icon: <Dumbbell className="w-8 h-8" />, textColor: "text-black" },
      { color: "bg-neo-green", icon: <Zap className="w-8 h-8" />, textColor: "text-black" },
      { color: "bg-neo-blue", icon: <Activity className="w-8 h-8" />, textColor: "text-white" },
      { color: "bg-neo-orange", icon: <Flower className="w-8 h-8" />, textColor: "text-black" },
      { color: "bg-neo-purple", icon: <Dumbbell className="w-8 h-8" />, textColor: "text-white" },
      { color: "bg-neo-yellow", icon: <Zap className="w-8 h-8" />, textColor: "text-black" },
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="min-h-[calc(100vh-180px)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-grid opacity-30 dark:opacity-10" />

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-blue text-white border-4 border-black rounded-base shadow-neo-sm font-bold text-sm">
                <ShoppingCart className="w-4 h-4" />
                LOJA DE TREINOS
              </div>
              <h1 className="text-5xl md:text-6xl font-heading text-black dark:text-white">
                CATÁLOGO DE TREINOS
              </h1>
            </div>

            {/* Search */}
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Buscar treinos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 border-4 border-black dark:border-white rounded-base font-medium"
                />
              </div>
              <Button
                variant="outline"
                className="h-14 px-6 border-4 border-black dark:border-white rounded-base font-bold shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
              >
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-20 h-20 bg-neo-blue border-4 border-black rounded-base shadow-neo flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
              </div>
              <p className="font-bold text-lg">Carregando treinos...</p>
            </div>
          ) : filteredTrainings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white dark:bg-gray-900 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-base"
            >
              <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-2xl font-heading text-gray-500">
                Nenhum treino encontrado
              </p>
              <p className="text-gray-400 mt-2">
                Tente uma busca diferente
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTrainings.map((treino, index) => {
                const { color, icon, textColor } = getIconAndColor(index);
                return (
                  <motion.div
                    key={treino.id}
                    variants={item}
                    className="group"
                  >
                    <div className={`${color} border-4 border-black rounded-base shadow-neo h-full flex flex-col
                      hover:shadow-neo-lg hover:translate-x-[-6px] hover:translate-y-[-6px] transition-all duration-200`}>
                      {/* Header */}
                      <div className="p-6 pb-0 flex justify-between items-start">
                        <div className="w-14 h-14 bg-black rounded-base flex items-center justify-center shadow-neo-sm">
                          <div className={textColor === "text-white" ? "text-white" : color.replace("bg-", "text-")}>
                            {icon}
                          </div>
                        </div>
                        <span className={`px-3 py-1 bg-black text-white text-xs font-bold rounded-base`}>
                          ID: {treino.id_professor}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className={`text-2xl font-heading mb-2 ${textColor}`}>
                          {treino.titulo}
                        </h3>
                        <p className={`text-sm font-medium flex-1 ${textColor === "text-white" ? "text-white/80" : "text-black/70"}`}>
                          {treino.descricao || "Sem descrição"}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="p-6 pt-0 flex items-center justify-between gap-4">
                        <div className={`text-3xl font-heading ${textColor}`}>
                          R$ {Number(treino.preco).toFixed(2)}
                        </div>
                        <Button
                          onClick={() =>
                            navigate(`/checkout/${treino.id}`, {
                              state: { training: treino },
                            })
                          }
                          className="bg-black text-white border-4 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] font-bold px-6"
                        >
                          COMPRAR
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Stats */}
          {!loading && filteredTrainings.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-base shadow-neo p-6"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold">
                  Mostrando <span className="text-neo-blue">{filteredTrainings.length}</span> treinos disponíveis
                </p>
                <div className="flex gap-2">
                  <span className="w-4 h-4 bg-neo-green border-2 border-black rounded-sm" />
                  <span className="w-4 h-4 bg-neo-blue border-2 border-black rounded-sm" />
                  <span className="w-4 h-4 bg-neo-pink border-2 border-black rounded-sm" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
