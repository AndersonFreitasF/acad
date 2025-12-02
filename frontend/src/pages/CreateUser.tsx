import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { userService, CreateUserData } from "../services/user";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, UserPlus, ArrowLeft, Save, Users } from "lucide-react";
import { motion } from "framer-motion";

export function CreateUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreateUserData & { confirmSenha: string }>({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmSenha: "",
  });

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!authService.isAuthenticated() || currentUser?.tipo !== "ADM") {
      navigate("/");
      return;
    }
  }, [navigate]);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData({ ...formData, cpf: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.senha !== formData.confirmSenha) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    const cpfNumeros = formData.cpf.replace(/\D/g, "");
    if (cpfNumeros.length !== 11) {
      setError("CPF inválido");
      return;
    }

    setLoading(true);

    try {
      await userService.create({
        nome: formData.nome,
        email: formData.email,
        cpf: cpfNumeros,
        senha: formData.senha,
      });
      navigate("/users");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-grid opacity-30 dark:opacity-10" />

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <button
              onClick={() => navigate("/users")}
              className="flex items-center gap-2 text-sm font-bold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para lista
            </button>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-pink border-4 border-black rounded-base shadow-neo-sm font-bold text-sm">
              <UserPlus className="w-4 h-4" />
              NOVO USUARIO
            </div>
            <h1 className="text-5xl font-heading text-black dark:text-white">
              CRIAR USUARIO
            </h1>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-base shadow-neo overflow-hidden"
          >
            <div className="p-6 bg-neo-pink border-b-4 border-black flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-base flex items-center justify-center border-3 border-black">
                <Users className="w-7 h-7 text-neo-pink" />
              </div>
              <div>
                <h2 className="text-xl font-heading">
                  Preencha os dados do novo usuário
                </h2>
                <p className="text-black/70 text-sm">Todos os campos são obrigatórios</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-neo-red/10 text-neo-red p-4 rounded-base border-4 border-neo-red font-bold text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-sm">Nome Completo</Label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="João Silva"
                    required
                    className="border-4 border-black dark:border-white rounded-base h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold uppercase text-sm">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="usuario@email.com"
                    required
                    className="border-4 border-black dark:border-white rounded-base h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold uppercase text-sm">CPF</Label>
                  <Input
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                    className="border-4 border-black dark:border-white rounded-base h-12"
                  />
                </div>

                <div className="border-t-4 border-dashed border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                  <h3 className="font-heading text-lg">Definir Senha</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold uppercase text-sm">Senha</Label>
                      <Input
                        type="password"
                        value={formData.senha}
                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        placeholder="••••••"
                        required
                        className="border-4 border-black dark:border-white rounded-base h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold uppercase text-sm">Confirmar Senha</Label>
                      <Input
                        type="password"
                        value={formData.confirmSenha}
                        onChange={(e) => setFormData({ ...formData, confirmSenha: e.target.value })}
                        placeholder="••••••"
                        required
                        className="border-4 border-black dark:border-white rounded-base h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => navigate("/users")}
                  variant="outline"
                  className="flex-1 h-14 text-lg font-bold border-4 border-black dark:border-white shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                >
                  CANCELAR
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-14 text-lg font-bold bg-neo-pink text-black border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[-4px] hover:translate-y-[-4px]"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      CRIAR USUARIO
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
