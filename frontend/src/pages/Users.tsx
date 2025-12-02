import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import {
  userService,
  User,
  CreateUserData,
  UpdateUserData,
} from "../services/user";
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

export function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  const [formData, setFormData] = useState<CreateUserData & UpdateUserData>({
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
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll({ size: 100 });
      setUsers(response.Usuarios || []);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && currentUser.id_usuario) {
        await userService.update(currentUser.id_usuario, {
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha || undefined,
        });
      } else {
        await userService.create(formData as CreateUserData);
      }
      await fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar usuário", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await userService.delete(id);
        fetchUsers();
      } catch (error) {
        console.error("Erro ao excluir usuário", error);
      }
    }
  };

  const startEdit = (user: User) => {
    setIsEditing(true);
    setCurrentUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      senha: "",
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentUser({});
    setFormData({ nome: "", email: "", cpf: "", senha: "" });
  };

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-heading text-black dark:text-white">
          GERENCIAR USUÁRIOS
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 h-fit bg-neo-yellow/20 border-neo-yellow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isEditing ? (
                <Pencil className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {isEditing ? "EDITAR USUÁRIO" : "NOVO USUÁRIO"}
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
                  className="flex-1 bg-neo-green text-black hover:bg-neo-green/90"
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
              {users.map((user) => (
                <div
                  key={user.id_usuario}
                  className="bg-white dark:bg-gray-800 p-4 border-3 border-black dark:border-gray-600 rounded-base shadow-neo flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h3 className="font-bold text-lg text-black dark:text-white">
                      {user.nome}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email} • {user.cpf}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-neo-blue text-white text-xs font-bold rounded-md">
                      {user.tipo}
                    </span>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(user)}
                      className="flex-1 md:flex-none"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user.id_usuario)}
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
