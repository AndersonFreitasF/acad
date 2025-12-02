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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

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
      exercicio_id: Number(selectedExerciseId),
      series,
      repeticoes: reps,
      carga: load,
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

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-heading text-black dark:text-white">
          GERENCIAR TREINOS
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 h-fit bg-neo-blue/20 border-neo-blue">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isEditing ? (
                <Pencil className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {isEditing ? "EDITAR TREINO" : "NOVO TREINO"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Preço</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </div>

              <div className="border-t-2 border-dashed border-black/20 my-4 pt-4">
                <Label className="mb-2 block">Adicionar Exercícios</Label>
                <div className="space-y-2">
                  <select
                    className="w-full h-10 rounded-base border-3 border-black px-3 bg-white"
                    value={selectedExerciseId}
                    onChange={(e) => setSelectedExerciseId(e.target.value)}
                  >
                    <option value="">Selecione o Exercício...</option>
                    {availableExercises.map((ex) => (
                      <option key={ex.id_exercicio} value={ex.id_exercicio}>
                        {ex.nome}
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="Séries"
                      value={series}
                      onChange={(e) => setSeries(Number(e.target.value))}
                    />
                    <Input
                      type="number"
                      placeholder="Repetições"
                      value={reps}
                      onChange={(e) => setReps(Number(e.target.value))}
                    />
                    <Input
                      type="number"
                      placeholder="Carga"
                      value={load}
                      onChange={(e) => setLoad(Number(e.target.value))}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddExercise}
                    className="w-full"
                    variant="secondary"
                  >
                    ADICIONAR EXERCÍCIO
                  </Button>
                </div>
              </div>

              {selectedExercises.length > 0 && (
                <div className="space-y-2 bg-white/50 p-2 rounded-base">
                  {selectedExercises.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm bg-white p-2 rounded border-2 border-black/10"
                    >
                      <div>
                        <span className="font-bold block">
                          {getExerciseName(item.exercicio_id)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.series}x{item.repeticoes} @ {item.carga}kg
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExercise(idx)}
                        className="text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-neo-blue text-white hover:bg-neo-blue/90"
                >
                  {isEditing ? "ATUALIZAR" : "CRIAR"}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={resetForm}
                  >
                    CANCELAR
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-neo-blue" />
            </div>
          ) : (
            <div className="grid gap-4">
              {trainings.map((training) => (
                <div
                  key={training.id}
                  className="bg-white dark:bg-gray-800 p-4 border-3 border-black dark:border-gray-600 rounded-base shadow-neo flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h3 className="font-bold text-lg text-black dark:text-white">
                      {training.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {training.descricao}
                    </p>
                    <span className="inline-block mt-2 font-mono font-bold text-neo-green">
                      R$ {training.preco}
                    </span>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(training)}
                      className="flex-1 md:flex-none"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(training.id)}
                      className="flex-1 md:flex-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
