import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { Shield, Zap, Globe, Moon, Sun, Crown } from "lucide-react";

const bg = 'var(--bg-secondary)';
const borderC = 'var(--border)';
const elevBg = 'var(--bg-card)';
const txt = 'var(--text)';
const tsec = 'var(--text-secondary)';
const tm = 'var(--text-muted)';
const ac = 'var(--accent)';

export default function Config() {
  const { theme, toggle, isDark } = useTheme();

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-3xl">
      <div><h1 className="text-xl lg:text-2xl font-bold tracking-tight" style={{ color: txt }}>Configuracoes</h1><p className="text-sm mt-0.5" style={{ color: tm }}>Gerencie sua conta e preferencias</p></div>

      <Card className="border" style={{ background: bg, borderColor: borderC }}>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: txt }}><Crown className="w-4 h-4" style={{ color: ac }} /> Perfil</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${ac}15` }}><span className="text-2xl font-bold" style={{ color: ac }}>T</span></div>
            <div><p className="font-medium" style={{ color: txt }}>Thiago Piola</p><p className="text-xs" style={{ color: tm }}>@Thiago</p><Badge className="text-[10px] mt-1" style={{ background: `${ac}15`, color: ac }}><Crown className="w-2.5 h-2.5 mr-0.5" /> Administrador</Badge></div>
          </div>
        </CardContent>
      </Card>

      <Card className="border" style={{ background: bg, borderColor: borderC }}>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: txt }}><Zap className="w-4 h-4" style={{ color: ac }} /> Preferencias</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-4 h-4" style={{ color: tm }} /> : <Sun className="w-4 h-4" style={{ color: tm }} />}
              <div><p className="text-sm" style={{ color: txt }}>Tema</p><p className="text-xs" style={{ color: tm }}>{isDark ? "Modo Escuro" : "Modo Claro"}</p></div>
            </div>
            <Switch checked={!isDark} onCheckedChange={toggle} />
          </div>
          <Separator style={{ background: borderC }} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Globe className="w-4 h-4" style={{ color: tm }} /><div><p className="text-sm" style={{ color: txt }}>Idioma</p><p className="text-xs" style={{ color: tm }}>Portugues (Brasil)</p></div></div>
          </div>
        </CardContent>
      </Card>

      <Card className="border" style={{ background: bg, borderColor: borderC }}>
        <CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: txt }}><Shield className="w-4 h-4" style={{ color: ac }} /> Plataforma</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3" style={{ background: elevBg }}><p className="text-[10px] uppercase tracking-wider" style={{ color: tm }}>Versao</p><p className="text-sm font-medium mt-0.5" style={{ color: txt }}>THIAGOLAB v2.0</p></div>
            <div className="rounded-lg p-3" style={{ background: elevBg }}><p className="text-[10px] uppercase tracking-wider" style={{ color: tm }}>Stack</p><p className="text-sm font-medium mt-0.5" style={{ color: txt }}>React + tRPC + MySQL</p></div>
          </div>
          <div className="rounded-lg p-3 space-y-2" style={{ background: elevBg }}>
            <h4 className="text-xs font-medium" style={{ color: txt }}>Modulos Ativos</h4>
            <div className="flex flex-wrap gap-2">
              {["CRM", "Pipeline", "Funis", "Cursos", "Comunidades", "Campanhas", "Agenda", "AI Studio", "Sites", "Projetos", "Docs", "Automacoes", "Pesquisa", "Monetizacao"].map(m => <Badge key={m} className="text-[10px]" style={{ background: `${ac}15`, color: ac }}>{m}</Badge>)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
