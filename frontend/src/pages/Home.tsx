import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 py-12 overflow-hidden">
      <section className="text-center space-y-6 max-w-2xl mx-auto px-4 relative">
        {/* Background decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-neo-yellow rounded-full blur-3xl -z-10 opacity-50"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-10 -right-20 w-60 h-60 bg-neo-purple rounded-full blur-3xl -z-10 opacity-50"
        />

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-6xl md:text-8xl font-heading text-black drop-shadow-[4px_4px_0_rgba(0,0,0,1)] leading-[0.9]"
        >
          ULTRAPASSE <span className="text-neo-blue">LIMITES</span>
          <br />
          QUEBRE <span className="text-neo-purple">RECORDS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl font-bold md:text-2xl"
        >
          Projeto de academia concluido!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="flex justify-center gap-4 pt-4"
        >
          <Button size="lg" className="text-lg bg-neo-green gap-2">
            Começar treino <Zap className="w-5 h-5 fill-current" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg gap-2">
            VER PLANOS <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4 mt-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white rotate-1 hover:rotate-0 transition-transform duration-300">
            <CardHeader>
              <CardTitle>Member Access</CardTitle>
              <CardDescription>
                Faça login para ver seu plano de treinos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-2 rounded-sm font-bold">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="fit@neo.gym"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button className="w-full" disabled={loading}>
                  {loading ? "LOGGING IN..." : "ENTER SYSTEM"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-neo-yellow -rotate-1 hover:rotate-0 transition-transform duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Planos <Trophy className="w-6 h-6" />
              </CardTitle>
              <CardDescription className="text-black/80">
                Junte-se hoje
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-base border-3 border-black shadow-neo-sm">
                <div className="flex justify-between items-start">
                  <h3 className="font-heading text-lg">Plano starter</h3>
                  <span className="bg-black text-white px-2 py-0.5 text-xs font-bold rounded-sm">
                    POPULAR
                  </span>
                </div>
                <p className="text-4xl font-heading mt-2">
                  R$99<span className="text-base font-normal">/mo</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm font-bold">
                  <li>✓ All Access Gym</li>
                  <li>✓ Personal Trainer</li>
                  <li>✓ Bate Papo com o treinador</li>
                  <li>✓ Plano nutricional</li>
                </ul>
              </div>
              <Button variant="secondary" className="w-full">
                Inscrever-se agora
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
