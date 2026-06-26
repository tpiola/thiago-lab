import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Zap, Lock, User, AlertCircle } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, loginError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070707] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0e0e0e] border border-[rgba(255,255,255,0.06)] mb-4 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
            <Zap className="w-8 h-8 text-[#00ff88]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">THIAGOLAB</h1>
          <p className="text-[#555] text-sm mt-2 font-medium">Plataforma de Monetizacao Inteligente</p>
        </div>

        <Card className="bg-[#0e0e0e] border-[rgba(255,255,255,0.06)] shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-white text-lg font-semibold">Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#555] text-xs uppercase tracking-wider font-medium">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333]" />
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-[#161616] border-[rgba(255,255,255,0.06)] text-white placeholder:text-[#333] focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/30 h-11"
                    placeholder="Digite seu usuario"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#555] text-xs uppercase tracking-wider font-medium">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333]" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-[#161616] border-[rgba(255,255,255,0.06)] text-white placeholder:text-[#333] focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/30 h-11"
                    placeholder="Digite sua senha"
                    required
                  />
                </div>
              </div>
              {loginError && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2.5 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {loginError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold h-11 text-sm transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Autenticando..." : "Entrar na Plataforma"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[#333] text-xs mt-6">
          Acesso exclusivo. Plataforma proprietaria THIAGOLAB.
        </p>
      </div>
    </div>
  );
}
