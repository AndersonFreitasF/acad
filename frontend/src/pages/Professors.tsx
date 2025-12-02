import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { professorService, Professor, ProfessorTreino } from "../services/professor";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2, Plus, Trash2, GraduationCap, Search, Dumbbell, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Professors() {
  const navigate = useNavigate();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProfessor, setExpandedProfessor] = useState<number | null>(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!authService.isAuthenticated() || currentUser?.tipo !== "ADM") {
      navigate("/");
      return;
    }
    fetchProfessors();
  }, [navigate]);

  const fetchProfessors = async () => {
    try {
      const response = await professorService.getAll();
      setProfessors(response.Professores || []);
    } catch (error) {
      console.error("Erro ao buscar professores", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o professor "${nome}"?`)) {
      try {
        await professorService.delete(id);
        fetchProfessors();
      } catch (error) {
        console.error("Erro ao excluir professor", error);
      }
    }
  };

  const filteredProfessors = professors.filter((prof) =>
    prof.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTreinos = (treinos: ProfessorTreino[] | null | undefined): ProfessorTreino[] => {
    if (!treinos || !Array.isArray(treinos)) return [];
    return treinos.filter(t => t !== null && t.id !== null);
  };

  const toggleExpand = (id: number) => {
    setExpandedProfessor(expandedProfessor === id ? null : id);
  };

  const formatPrice = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
  };

  return (
    <div className="min-h-[calc(100vh-180px)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-40 dark:opacity-20" />

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-purple text-white border-4 border-black rounded-base shadow-neo-sm font-bold text-sm">
                <GraduationCap className="w-4 h-4" />
                EQUIPE
              </div>
              <h1 className="text-5xl md:text-6xl font-heading text-black dark:text-white">
                GERENCIAR PROFESSORES
              </h1>
            </div>

            <Button
              onClick={() => navigate("/professors/create")}
              className="h-14 px-8 bg-neo-green text-black border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[-4px] hover:translate-y-[-4px] font-bold text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              NOVO PROFESSOR
            </Button>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 border-4 border-black dark:border-white rounded-base font-medium"
            />
          </motion.div>

          {/* Professor Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-16 h-16 bg-neo-purple border-4 border-black rounded-base shadow-neo flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              </div>
            ) : filteredProfessors.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-base shadow-neo p-20 text-center">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-2xl font-heading text-gray-500">
                  Nenhum professor encontrado
                </p>
              </div>
            ) : (
              filteredProfessors.map((prof) => {
                const treinos = getTreinos(prof.treinos);
                const isExpanded = expandedProfessor === prof.id_usuario;
                
                return (
                  <div
                    key={prof.id_usuario}
                    className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-base shadow-neo overflow-hidden"
                  >
                    {/* Professor Row */}
                    <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 bg-neo-purple rounded-base flex items-center justify-center border-3 border-black flex-shrink-0">
                          <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-heading text-xl truncate">{prof.nome}</h3>
                          <p className="text-sm text-gray-500 truncate">{prof.email}</p>
                          <p className="text-xs font-mono text-gray-400">{prof.cpf || "CPF não informado"}</p>
                        </div>
                      </div>

                      {/* Treinos Badge & Actions */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                          onClick={() => treinos.length > 0 && toggleExpand(prof.id_usuario)}
                          disabled={treinos.length === 0}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-base border-3 border-black font-bold text-sm transition-all ${
                            treinos.length > 0 
                              ? "bg-neo-green text-black cursor-pointer hover:bg-neo-green/80" 
                              : "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <Dumbbell className="w-4 h-4" />
                          {treinos.length} {treinos.length === 1 ? "treino" : "treinos"}
                          {treinos.length > 0 && (
                            isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        <Button
                          size="sm"
                          onClick={() => handleDelete(prof.id_usuario, prof.nome)}
                          className="h-10 px-4 bg-neo-red text-white border-3 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </div>

                    {/* Expandable Treinos List */}
                    <AnimatePresence>
                      {isExpanded && treinos.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t-4 border-black dark:border-white bg-neo-green/10"
                        >
                          <div className="p-4">
                            <h4 className="font-heading text-sm mb-3 flex items-center gap-2">
                              <Dumbbell className="w-4 h-4" />
                              TREINOS CRIADOS POR {prof.nome.split(" ")[0].toUpperCase()}
                            </h4>
                            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                              {treinos.map((treino) => (
                                <div
                                  key={treino.id}
                                  className="bg-white dark:bg-gray-800 p-3 rounded-base border-3 border-black flex items-center justify-between gap-2"
                                >
                                  <div className="min-w-0">
                                    <p className="font-bold text-sm truncate">{treino.titulo}</p>
                                    <p className="text-xs text-gray-500">ID: #{treino.id}</p>
                                  </div>
                                  <span className="px-2 py-1 bg-neo-yellow text-black text-xs font-bold rounded border-2 border-black flex-shrink-0">
                                    {formatPrice(treino.preco)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </motion.div>

          {/* Stats */}
          {!loading && filteredProfessors.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-neo-purple/20 border-4 border-neo-purple rounded-base p-4"
            >
              <p className="font-bold text-center">
                Total de <span className="text-neo-purple">{filteredProfessors.length}</span> professores
                {" • "}
                <span className="text-neo-green">
                  {filteredProfessors.reduce((acc, p) => acc + getTreinos(p.treinos).length, 0)}
                </span> treinos criados
                {searchTerm && ` (filtrado por "${searchTerm}")`}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
