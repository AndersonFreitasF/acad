import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import {
  exerciseService,
  Exercise,
  CreateExerciseData,
  UpdateExerciseData,
} from "../services/exercise";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, Plus, Pencil, Trash2, ClipboardList, X, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Exercises() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Partial<Exercise>>({});
  const [formData, setFormData] = useState<
    CreateExerciseData & UpdateExerciseData
  >({
    nome: "",
    descricao: "",
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/");
      return;
    }
    fetchExercises();
  }, [navigate]);

  const fetchExercises = async () => {
    try {
      const response = await exerciseService.getAll({ size: 100 });
      setExercises(response.Exercicios || []);
    } catch (error) {
      console.error("Erro ao buscar exercícios", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && currentExercise.id_exercicio) {
        await exerciseService.update(currentExercise.id_exercicio, formData);
      } else {
        await exerciseService.create(formData as CreateExerciseData);
      }
      await fetchExercises();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar exercício", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este exercício?")) {
      try {
        await exerciseService.delete(id);
        fetchExercises();
      } catch (error) {
        console.error("Erro ao excluir exercício", error);
      }
    }
  };

  const startEdit = (exercise: Exercise) => {
    setIsEditing(true);
    setCurrentExercise(exercise);
    setFormData({
      nome: exercise.nome,
      descricao: exercise.descricao,
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentExercise({});
    setFormData({ nome: "", descricao: "" });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-orange border-4 border-black rounded-base shadow-neo-sm font-bold text-sm">
                <ClipboardList className="w-4 h-4" />
                BIBLIOTECA
              </div>
              <h1 className="text-5xl md:text-6xl font-heading text-black dark:text-white">
                GERENCIAR EXERCÍCIOS
              </h1>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-neo-orange border-4 border-black rounded-base shadow-neo sticky top-24">
                <div className="p-6 border-b-4 border-black flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-base flex items-center justify-center">
                      {isEditing ? (
                        <Pencil className="w-5 h-5 text-neo-orange" />
                      ) : (
                        <Plus className="w-5 h-5 text-neo-orange" />
                      )}
                    </div>
                    <h2 className="text-xl font-heading">
                      {isEditing ? "EDITAR" : "NOVO EXERCICIO"}
                    </h2>
                  </div>
                  {isEditing && (
                    <button
                      onClick={resetForm}
                      className="w-8 h-8 bg-black rounded-base flex items-center justify-center hover:bg-gray-800"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold uppercase text-sm">Nome do Exercicio</Label>
                    <Input
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      placeholder="Ex: Supino Reto"
                      required
                      className="border-4 border-black rounded-base h-12 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold uppercase text-sm">Descricao</Label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) =>
                        setFormData({ ...formData, descricao: e.target.value })
                      }
                      placeholder="Descreva o exercício..."
                      required
                      rows={4}
                      className="w-full border-4 border-black rounded-base p-3 font-medium bg-white resize-none focus:outline-none focus:ring-4 focus:ring-neo-orange/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-black text-white border-4 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] font-bold"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isEditing ? (
                      "ATUALIZAR"
                    ) : (
                      "CRIAR EXERCICIO"
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              {loading && exercises.length === 0 ? (
                <div className="flex justify-center py-20">
                  <div className="w-16 h-16 bg-neo-orange border-4 border-black rounded-base shadow-neo flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                </div>
              ) : exercises.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white dark:bg-gray-900 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-base"
                >
                  <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-2xl font-heading text-gray-500">
                    Nenhum exercicio cadastrado
                  </p>
                  <p className="text-gray-400 mt-2">
                    Crie seu primeiro exercicio ao lado
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid md:grid-cols-2 gap-4"
                >
                  <AnimatePresence>
                    {exercises.map((exercise) => (
                      <motion.div
                        key={exercise.id_exercicio}
                        variants={item}
                        layout
                        className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-base shadow-neo
                          hover:shadow-neo-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="w-12 h-12 bg-neo-orange rounded-base flex items-center justify-center border-3 border-black flex-shrink-0">
                              <Dumbbell className="w-6 h-6" />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(exercise)}
                                className="w-9 h-9 bg-neo-yellow border-3 border-black rounded-base flex items-center justify-center shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(exercise.id_exercicio)}
                                className="w-9 h-9 bg-neo-red text-white border-3 border-black rounded-base flex items-center justify-center shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <h3 className="font-heading text-xl text-black dark:text-white mb-2">
                            {exercise.nome}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium line-clamp-2">
                            {exercise.descricao}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Stats */}
              {exercises.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-neo-orange/20 border-4 border-neo-orange rounded-base p-4"
                >
                  <p className="font-bold text-center">
                    Total de <span className="text-neo-orange">{exercises.length}</span> exercicios cadastrados
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
