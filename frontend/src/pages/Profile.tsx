import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { userService, User, UpdateUserData } from "../services/user";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, User as UserIcon, Mail, Lock, Save, ArrowLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }
    const currentUser = authService.getUser();
    setUser(currentUser);
    if (currentUser) {
      setFormData({
        nome: currentUser.nome || "",
        email: currentUser.email || "",
        senha: "",
        confirmSenha: "",
      });
    }
  }, [navigate]);

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "ADM": return "Administrador";
      case "PROFESSOR": return "Professor";
      case "ALUNO": return "Aluno";
      default: return tipo;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "ADM": return "bg-neo-pink";
      case "PROFESSOR": return "bg-neo-purple text-white";
      case "ALUNO": return "bg-neo-blue text-white";
      default: return "bg-gray-500";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (formData.senha && formData.senha !== formData.confirmSenha) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.senha && formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const updateData: UpdateUserData = {
        nome: formData.nome,
        email: formData.email,
      };

      if (formData.senha) {
        updateData.senha = formData.senha;
      }

      await userService.update(user!.id_usuario, updateData);
      
      // Update local storage with new data
      const updatedUser = { ...user!, nome: formData.nome, email: formData.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess(true);
      setFormData({ ...formData, senha: "", confirmSenha: "" });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-180px)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-40 dark:opacity-20" />

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-blue text-white border-4 border-black rounded-base shadow-neo-sm font-bold text-sm">
              <UserIcon className="w-4 h-4" />
              MEU PERFIL
            </div>
            <h1 className="text-5xl font-heading text-black dark:text-white">
              EDITAR PERFIL
            </h1>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-base shadow-neo overflow-hidden"
          >
            {/* User Info Header */}
            <div className="p-6 bg-neo-blue border-b-4 border-black">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-black rounded-base flex items-center justify-center border-4 border-black shadow-neo">
                  <UserIcon className="w-10 h-10 text-neo-blue" />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-heading">{user.nome}</h2>
                  <p className="text-white/80">{user.email}</p>
                  <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-base border-2 border-black ${getTipoColor(user.tipo)}`}>
                    {getTipoLabel(user.tipo)}
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
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

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-neo-green/10 text-neo-green p-4 rounded-base border-4 border-neo-green font-bold text-sm"
                >
                  Perfil atualizado com sucesso!
                </motion.div>
              )}

              <div className="space-y-4">
                <h3 className="font-heading text-lg flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Dados Pessoais
                </h3>
                
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-sm">Nome Completo</Label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="border-4 border-black dark:border-white rounded-base h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold uppercase text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-4 border-black dark:border-white rounded-base h-12"
                    required
                  />
                </div>
              </div>

              <div className="border-t-4 border-dashed border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                <h3 className="font-heading text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Alterar Senha
                </h3>
                <p className="text-sm text-gray-500">Deixe em branco para manter a senha atual</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold uppercase text-sm">Nova Senha</Label>
                    <Input
                      type="password"
                      value={formData.senha}
                      onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                      placeholder="••••••"
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
                      className="border-4 border-black dark:border-white rounded-base h-12"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-lg font-bold bg-neo-green text-black border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    SALVAR ALTERACOES
                  </>
                )}
              </Button>
            </form>

            {/* Security Info */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t-4 border-black dark:border-white">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-500">
                  <p className="font-bold">Informacoes de seguranca</p>
                  <p>ID do usuario: {user.id_usuario}</p>
                  <p>CPF: {user.cpf || "Nao informado"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

