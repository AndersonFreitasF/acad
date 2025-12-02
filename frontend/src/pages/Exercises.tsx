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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

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

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-heading text-black dark:text-white">
          GERENCIAR EXERCÍCIOS
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 h-fit bg-neo-pink/20 border-neo-pink">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isEditing ? (
                <Pencil className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {isEditing ? "EDITAR EXERCÍCIO" : "NOVO EXERCÍCIO"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-neo-pink text-white hover:bg-neo-pink/90"
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
              {exercises.map((exercise) => (
                <div
                  key={exercise.id_exercicio}
                  className="bg-white dark:bg-gray-800 p-4 border-3 border-black dark:border-gray-600 rounded-base shadow-neo flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h3 className="font-bold text-lg text-black dark:text-white">
                      {exercise.nome}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {exercise.descricao}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(exercise)}
                      className="flex-1 md:flex-none"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(exercise.id_exercicio)}
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
