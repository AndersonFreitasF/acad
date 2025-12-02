import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import {
  professorService,
  Professor,
  CreateProfessorData,
  UpdateProfessorData,
} from "../services/professor";
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

export function Professors() {
  const navigate = useNavigate();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfessor, setCurrentProfessor] = useState<Partial<Professor>>(
    {}
  );
  const [formData, setFormData] = useState<
    CreateProfessorData & UpdateProfessorData
  >({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/");
      return;
    }
    fetchProfessors();
  }, [navigate]);

  const fetchProfessors = async () => {
    try {
      const response = await professorService.getAll({ size: 100 });
      setProfessors(response.Professores || []);
    } catch (error) {
      console.error("Erro ao buscar professores", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && currentProfessor.id_usuario) {
        await professorService.update(currentProfessor.id_usuario, {
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha || undefined,
        });
      } else {
        await professorService.create(formData as CreateProfessorData); // Fix type assertion
      }
      await fetchProfessors();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar professor", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este professor?")) {
      try {
        await professorService.delete(id);
        fetchProfessors();
      } catch (error) {
        console.error("Erro ao excluir professor", error);
      }
    }
  };

  const startEdit = (prof: Professor) => {
    setIsEditing(true);
    setCurrentProfessor(prof);
    setFormData({
      nome: prof.nome,
      email: prof.email,
      cpf: prof.cpf,
      senha: "",
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProfessor({});
    setFormData({ nome: "", email: "", cpf: "", senha: "" });
  };

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-heading text-black dark:text-white">
          GERENCIAR PROFESSORES
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 h-fit bg-neo-purple/20 border-neo-purple">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isEditing ? (
                <Pencil className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {isEditing ? "EDITAR PROFESSOR" : "NOVO PROFESSOR"}
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData({ ...formData, cpf: e.target.value })
                  }
                  disabled={isEditing}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">
                  Senha {isEditing && "(Deixe em branco para manter a atual)"}
                </Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) =>
                    setFormData({ ...formData, senha: e.target.value })
                  }
                  required={!isEditing}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-neo-purple text-white hover:bg-neo-purple/90"
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
              {professors.map((prof) => (
                <div
                  key={prof.id_usuario}
                  className="bg-white dark:bg-gray-800 p-4 border-3 border-black dark:border-gray-600 rounded-base shadow-neo flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h3 className="font-bold text-lg text-black dark:text-white">
                      {prof.nome}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {prof.email} • {prof.cpf}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(prof)}
                      className="flex-1 md:flex-none"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(prof.id_usuario)}
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
