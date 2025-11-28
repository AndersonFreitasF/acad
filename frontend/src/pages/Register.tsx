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
import { Loader2 } from "lucide-react";

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
    e.preventDefault(); // IMPORTANTE: Prevenir submit padrão
    setLoading(true);
    setError("");

    console.log("🚀 Iniciando cadastro..."); // DEBUG

    // Validações
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

    console.log("📤 Payload:", payload); // DEBUG

    try {
      const response = await userService.register(payload);
      console.log("✅ Sucesso:", response); // DEBUG

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("❌ Erro completo:", err); // DEBUG
      console.error("❌ Response:", err.response?.data); // DEBUG

      setError(
        err.response?.data?.message || "Erro ao criar conta. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-neo-green bg-neo-green/10">
          <CardHeader>
            <CardTitle className="text-3xl font-heading text-center">
              ✓ CONTA CRIADA!
            </CardTitle>
            <CardDescription className="text-center">
              Redirecionando para o login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-heading">CADASTRO</CardTitle>
          <CardDescription>
            Crie sua conta para começar a treinar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-base border-2 border-destructive font-bold">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                name="nome"
                placeholder="João Silva"
                value={formData.nome}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="joao@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleCPFChange}
                disabled={loading}
                maxLength={14}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="••••••••"
                value={formData.senha}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmSenha">Confirmar Senha</Label>
              <Input
                id="confirmSenha"
                name="confirmSenha"
                type="password"
                placeholder="••••••••"
                value={formData.confirmSenha}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  CRIANDO CONTA...
                </>
              ) : (
                "CRIAR CONTA"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Já tem uma conta?{" "}
            <Link
              to="/register"
              className="text-neo-blue font-bold hover:underline"
            >
              Faça login aqui
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
