import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <Card className="w-full max-w-sm border text-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <CardContent className="py-8">
          <h1 className="text-5xl font-bold" style={{ color: 'var(--accent)' }}>404</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Pagina nao encontrada</p>
          <Button asChild className="w-full mt-4 font-semibold" style={{ background: 'var(--accent)', color: '#000' }}>
            <Link to="/" className="flex items-center justify-center gap-2"><Home className="w-4 h-4" /> Voltar ao Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
