import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { userService, User } from "../services/user";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2, Plus, Trash2, Users as UsersIcon, Search } from "lucide-react";
import { motion } from "framer-motion";

export function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!authService.isAuthenticated() || currentUser?.tipo !== "ADM") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.Usuarios || []);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${nome}"?`)) {
      try {
        await userService.delete(id);
        fetchUsers();
      } catch (error) {
        console.error("Erro ao excluir usuário", error);
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "ADM": return "bg-neo-pink text-black";
      case "PROFESSOR": return "bg-neo-purple text-white";
      case "ALUNO": return "bg-neo-blue text-white";
      default: return "bg-gray-500 text-white";
    }
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-pink border-4 border-black rounded-base shadow-neo-sm font-bold text-sm">
                <UsersIcon className="w-4 h-4" />
                ADMINISTRACAO
              </div>
              <h1 className="text-5xl md:text-6xl font-heading text-black dark:text-white">
                GERENCIAR USUARIOS
              </h1>
            </div>

            <Button
              onClick={() => navigate("/users/create")}
              className="h-14 px-8 bg-neo-green text-black border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[-4px] hover:translate-y-[-4px] font-bold text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              NOVO USUARIO
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

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-base shadow-neo overflow-hidden"
          >
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-16 h-16 bg-neo-pink border-4 border-black rounded-base shadow-neo flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-20">
                <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-2xl font-heading text-gray-500">
                  Nenhum usuario encontrado
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neo-pink border-b-4 border-black">
                      <th className="px-6 py-4 text-left font-heading text-sm uppercase">Nome</th>
                      <th className="px-6 py-4 text-left font-heading text-sm uppercase">Email</th>
                      <th className="px-6 py-4 text-left font-heading text-sm uppercase">CPF</th>
                      <th className="px-6 py-4 text-left font-heading text-sm uppercase">Tipo</th>
                      <th className="px-6 py-4 text-center font-heading text-sm uppercase">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user.id_usuario}
                        className={`border-b-2 border-black/10 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800/50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <span className="font-bold">{user.nome}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 font-mono text-sm">
                          {user.cpf || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-base border-2 border-black ${getTipoColor(user.tipo)}`}>
                            {user.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <Button
                              size="sm"
                              onClick={() => handleDelete(user.id_usuario, user.nome)}
                              className="h-9 px-4 bg-neo-red text-white border-3 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-neo-pink/20 border-4 border-neo-pink rounded-base p-4"
            >
              <p className="font-bold text-center">
                Total de <span className="text-neo-pink">{filteredUsers.length}</span> usuarios
                {searchTerm && ` encontrados para "${searchTerm}"`}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
