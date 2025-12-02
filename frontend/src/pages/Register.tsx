import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { userService } from "../services/user";
import { Loader2, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    confirmSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [asaasWarning, setAsaasWarning] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
    setFormData({
      ...formData,
      cpf: formatted,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAsaasWarning(false);

    if (formData.senha !== formData.confirmSenha) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    const cpfNumeros = formData.cpf.replace(/\D/g, "");
    if (cpfNumeros.length !== 11) {
      setError("CPF inválido");
      setLoading(false);
      return;
    }

    const payload = {
      nome: formData.nome,
      email: formData.email,
      cpf: cpfNumeros,
      senha: formData.senha,
    };

    try {
      const response = await userService.register(payload);

      // Try to create ASAAS customer
      try {
        if (response.id_usuario) {
          await userService.createCustomerAsaas(response.id_usuario);
        }
      } catch (asaasError) {
        // ASAAS registration failed - show warning but continue
        console.warn("Falha ao criar cliente ASAAS:", asaasError);
        setAsaasWarning(true);
      }

      setSuccess(true);
      setTimeout(
        () => {
          navigate("/login");
        },
        asaasWarning ? 4000 : 2000
      );
    } catch (err: any) {
      console.error("Erro completo:", err);
      setError(
        err.response?.data?.message || "Erro ao criar conta. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-30 dark:opacity-10" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="space-y-4"
        >
          <Card
            className={`w-full max-w-md border-4 border-black shadow-neo-lg ${
              asaasWarning ? "bg-neo-yellow" : "bg-neo-green"
            }`}
          >
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto"
              >
                {asaasWarning ? (
                  <AlertTriangle className="w-10 h-10 text-neo-yellow" />
                ) : (
                  <CheckCircle className="w-10 h-10 text-neo-green" />
                )}
              </motion.div>
              <CardTitle className="text-4xl font-heading">
                CONTA CRIADA!
              </CardTitle>
              <CardDescription className="text-black font-medium text-lg">
                {asaasWarning ? (
                  <>
                    Sua conta foi criada, mas houve um problema ao configurar o
                    sistema de pagamentos.
                    <br />
                    <span className="text-sm">
                      Isso será resolvido automaticamente na sua primeira
                      compra.
                    </span>
                  </>
                ) : (
                  "Redirecionando para o login..."
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-diagonal opacity-30 dark:opacity-10" />

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 1, rotate: 12 }}
        transition={{ duration: 0.6 }}
        className="absolute top-10 right-10 w-28 h-28 bg-neo-purple border-4 border-black rounded-base shadow-neo hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, rotate: 20 }}
        animate={{ opacity: 1, rotate: -6 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute bottom-10 left-10 w-24 h-24 bg-neo-orange border-4 border-black shadow-neo hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute top-40 left-20 w-16 h-16 bg-neo-pink border-4 border-black rounded-full shadow-neo hidden lg:block"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-4 border-black dark:border-white shadow-neo-lg bg-white dark:bg-gray-900">
          <CardHeader className="space-y-4 pb-6 bg-neo-purple border-b-4 border-black dark:border-white">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-base flex items-center justify-center shadow-neo">
                <Zap className="w-8 h-8 text-neo-purple" />
              </div>
            </div>
            <CardTitle className="text-4xl font-heading text-center text-white">
              CADASTRO
            </CardTitle>
            <CardDescription className="text-center text-white/80 font-medium">
              Crie sua conta para começar a treinar
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-neo-red/10 text-neo-red p-4 rounded-base border-4 border-neo-red font-bold text-sm"
                >
                  {error}
                </motion.div>
              )}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-bold uppercase">
                  Nome Completo
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="João Silva"
                  value={formData.nome}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="border-4 border-black dark:border-white rounded-base h-12 font-medium focus:ring-4 focus:ring-neo-purple/50 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-neo transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold uppercase">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="joao@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="border-4 border-black dark:border-white rounded-base h-12 font-medium focus:ring-4 focus:ring-neo-purple/50 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-neo transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-sm font-bold uppercase">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  disabled={loading}
                  maxLength={14}
                  required
                  className="border-4 border-black dark:border-white rounded-base h-12 font-medium focus:ring-4 focus:ring-neo-purple/50 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-neo transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="senha"
                    className="text-sm font-bold uppercase"
                  >
                    Senha
                  </Label>
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="••••••"
                    value={formData.senha}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="border-4 border-black dark:border-white rounded-base h-12 font-medium focus:ring-4 focus:ring-neo-purple/50 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-neo transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmSenha"
                    className="text-sm font-bold uppercase"
                  >
                    Confirmar
                  </Label>
                  <Input
                    id="confirmSenha"
                    name="confirmSenha"
                    type="password"
                    placeholder="••••••"
                    value={formData.confirmSenha}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="border-4 border-black dark:border-white rounded-base h-12 font-medium focus:ring-4 focus:ring-neo-purple/50 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-neo transition-all"
                  />
                </div>
              </div>
              <Button
                className="w-full h-14 text-lg font-bold bg-neo-yellow text-black border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all mt-2"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    CRIANDO CONTA...
                  </>
                ) : (
                  <>
                    CRIAR CONTA
                    <Zap className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2 pb-6">
            <div className="text-sm text-center font-medium">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-neo-purple font-bold hover:underline decoration-4 underline-offset-4"
              >
                Faça login aqui
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
