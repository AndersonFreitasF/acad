import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import {
  trainingService,
  Training,
  CreateTrainingData,
  ExerciseTraining,
} from "../services/training";
import { exerciseService, Exercise } from "../services/exercise";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, Plus, Pencil, Trash2, X, LayoutDashboard, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Trainings() {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTraining, setCurrentTraining] = useState<Partial<Training>>({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseTraining[]
  >([]);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [series, setSeries] = useState(3);
  const [reps, setReps] = useState(12);
  const [load, setLoad] = useState(0);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/");
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [trainingsData, exercisesData] = await Promise.all([
        trainingService.getMyTrainings({ size: 100 }),
        exerciseService.getAll({ size: 100 }),
      ]);
      setTrainings(trainingsData);
      setAvailableExercises(exercisesData.Exercicios || []);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    if (!selectedExerciseId) return;

    const newExercise: ExerciseTraining = {
      id_exercicio: Number(selectedExerciseId),
      series_repeticoes: `${series}x${reps}`,
      carga: String(load),
    };

    setSelectedExercises([...selectedExercises, newExercise]);
    setSelectedExerciseId("");
    setSeries(3);
    setReps(12);
    setLoad(0);
  };

  const removeExercise = (index: number) => {
    const newList = [...selectedExercises];
    newList.splice(index, 1);
    setSelectedExercises(newList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = authService.getUser();
    if (!user) return;

    const payload: CreateTrainingData = {
      titulo: title,
      descricao: description,
      preco: Number(price),
      id_professor: user.id_usuario,
      exercicios: selectedExercises,
    };

    try {
      if (isEditing && currentTraining.id) {
        await trainingService.update(currentTraining.id, {
          titulo: title,
          descricao: description,
          exercicios: selectedExercises,
        });
      } else {
        await trainingService.create(payload);
      }
      await fetchData();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar treino", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este treino?")) {
      try {
        await trainingService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Erro ao excluir treino", error);
      }
    }
  };

  const startEdit = (training: Training) => {
    setIsEditing(true);
    setCurrentTraining(training);
    setTitle(training.titulo);
    setDescription(training.descricao || "");
    setPrice(training.preco);
    setSelectedExercises([]);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentTraining({});
    setTitle("");
    setDescription("");
    setPrice(0);
    setSelectedExercises([]);
  };

  const getExerciseName = (id: number) => {
    return (
      availableExercises.find((e) => e.id_exercicio === id)?.nome ||
      "Exercício Desconhecido"
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-green border-4 border-black rounded-base shadow-neo-sm font-bold text-sm">
                <LayoutDashboard className="w-4 h-4" />
                CRIACAO
              </div>
              <h1 className="text-5xl md:text-6xl font-heading text-black dark:text-white">
                GERENCIAR TREINOS
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
              <div className="bg-neo-green border-4 border-black rounded-base shadow-neo sticky top-24">
                <div className="p-6 border-b-4 border-black flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-base flex items-center justify-center">
                      {isEditing ? (
                        <Pencil className="w-5 h-5 text-neo-green" />
                      ) : (
                        <Plus className="w-5 h-5 text-neo-green" />
                      )}
                    </div>
                    <h2 className="text-xl font-heading">
                      {isEditing ? "EDITAR" : "NOVO TREINO"}
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
                    <Label className="font-bold uppercase text-sm">Titulo</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Treino de Peito"
                      required
                      className="border-4 border-black rounded-base h-12 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold uppercase text-sm">Descricao</Label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva o treino..."
                      required
                      className="border-4 border-black rounded-base h-12 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold uppercase text-sm">Preco (R$)</Label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      required
                      className="border-4 border-black rounded-base h-12 bg-white"
                    />
                  </div>

                  {/* Exercise Selector */}
                  <div className="border-t-4 border-dashed border-black/30 my-4 pt-4">
                    <Label className="font-bold uppercase text-sm block mb-3">Adicionar Exercicios</Label>
                    <div className="space-y-3">
                      <select
                        className="w-full h-12 rounded-base border-4 border-black px-3 bg-white font-medium"
                        value={selectedExerciseId}
                        onChange={(e) => setSelectedExerciseId(e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        {availableExercises.map((ex) => (
                          <option key={ex.id_exercicio} value={ex.id_exercicio}>
                            {ex.nome}
                          </option>
                        ))}
                      </select>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs font-bold">Series</Label>
                          <Input
                            type="number"
                            value={series}
                            onChange={(e) => setSeries(Number(e.target.value))}
                            className="border-3 border-black h-10 bg-white"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-bold">Reps</Label>
                          <Input
                            type="number"
                            value={reps}
                            onChange={(e) => setReps(Number(e.target.value))}
                            className="border-3 border-black h-10 bg-white"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-bold">Carga</Label>
                          <Input
                            type="number"
                            value={load}
                            onChange={(e) => setLoad(Number(e.target.value))}
                            className="border-3 border-black h-10 bg-white"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddExercise}
                        disabled={!selectedExerciseId}
                        className="w-full h-10 bg-white text-black border-3 border-black font-bold disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        ADICIONAR
                      </Button>
                    </div>
                  </div>

                  {/* Selected Exercises */}
                  {selectedExercises.length > 0 && (
                    <div className="space-y-2 bg-white/50 p-3 rounded-base border-3 border-black/20">
                      {selectedExercises.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-white p-3 rounded-base border-3 border-black"
                        >
                          <div>
                            <span className="font-bold block text-sm">
                              {getExerciseName(item.id_exercicio)}
                            </span>
                            <span className="text-xs text-gray-600">
                              {item.series_repeticoes} @ {item.carga}kg
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExercise(idx)}
                            className="w-7 h-7 bg-neo-red text-white rounded-base flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

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
                      "CRIAR TREINO"
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              {loading && trainings.length === 0 ? (
                <div className="flex justify-center py-20">
                  <div className="w-16 h-16 bg-neo-green border-4 border-black rounded-base shadow-neo flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                </div>
              ) : trainings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white dark:bg-gray-900 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-base"
                >
                  <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-2xl font-heading text-gray-500">
                    Nenhum treino criado
                  </p>
                  <p className="text-gray-400 mt-2">
                    Crie seu primeiro treino ao lado
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  <AnimatePresence>
                    {trainings.map((training) => (
                      <motion.div
                        key={training.id}
                        variants={item}
                        layout
                        className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-base shadow-neo
                          hover:shadow-neo-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all"
                      >
                        <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 bg-neo-green rounded-base flex items-center justify-center border-3 border-black">
                                <Dumbbell className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-heading text-xl text-black dark:text-white">
                                  {training.titulo}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                  {training.descricao}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-4">
                              <span className="text-2xl font-heading text-neo-green">
                                R$ {Number(training.preco).toFixed(2)}
                              </span>
                              {training.exercicios && training.exercicios.length > 0 && (
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold rounded-base border-2 border-black dark:border-white">
                                  {training.exercicios.length} exercicios
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => startEdit(training)}
                              className="h-10 px-4 bg-neo-yellow text-black border-3 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDelete(training.id)}
                              className="h-10 px-4 bg-neo-red text-white border-3 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Stats */}
              {trainings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-neo-green/20 border-4 border-neo-green rounded-base p-4"
                >
                  <p className="font-bold text-center">
                    Total de <span className="text-neo-green">{trainings.length}</span> treinos criados
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
