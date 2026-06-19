"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Clock, Code } from "lucide-react";

/* ==========================================================================
   TemplateCard — preview card for website templates
   Gold accents, hover glow, click to populate prompt
   /thiagobuild — dark + gold + glassmorphism
   ========================================================================== */

export interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  gradient: string;
  icon: string;
  prompt: string;
  color: string;
}

const TEMPLATES: Template[] = [
  {
    id: "startup",
    name: "Startup Moderna",
    description: "Landing page completa para startups com hero, features, pricing e CTA",
    tags: ["Landing Page", "Startup", "Moderno"],
    gradient: "from-thiagobuild-gold via-amber-500 to-orange-600",
    icon: "🚀",
    prompt: "Landing page moderna para startup de tecnologia com hero animado, seção de features com grid 3 colunas, planos de pricing, depoimentos de clientes e CTA final. Design escuro com acentos dourados.",
    color: "#D4AF37",
  },
  {
    id: "saas",
    name: "SaaS Dashboard",
    description: "Dashboard analytics com sidebar, gráficos e métricas em tempo real",
    tags: ["Dashboard", "SaaS", "Analytics"],
    gradient: "from-blue-600 via-indigo-500 to-violet-600",
    icon: "📊",
    prompt: "Dashboard SaaS completo com sidebar de navegação, gráficos de receita, métricas de KPIs, tabela de dados e perfil de usuário. Tema escuro profissional.",
    color: "#6366F1",
  },
  {
    id: "portfolio",
    name: "Portfolio Criativo",
    description: "Portfolio visual com grid de projetos, galeria e modo escuro",
    tags: ["Portfolio", "Criativo", "Visual"],
    gradient: "from-pink-500 via-rose-500 to-red-600",
    icon: "🎨",
    prompt: "Portfolio criativo para designer/fotógrafo com hero fullscreen, grid de projetos masonry, galeria de imagens com lightbox, seção sobre e contato. Design minimalista escuro.",
    color: "#F43F5E",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Loja virtual completa com grid de produtos, carrinho e busca",
    tags: ["E-commerce", "Loja", "Vitrine"],
    gradient: "from-emerald-500 via-green-500 to-teal-600",
    icon: "🛍️",
    prompt: "Loja virtual de e-commerce com grid de produtos, carrinho lateral, barra de busca, categorias, página de produto com detalhes e footer completo. Design escuro elegante.",
    color: "#10B981",
  },
  {
    id: "blog",
    name: "Blog Tech",
    description: "Blog moderno com grid de artigos, sidebar e busca integrada",
    tags: ["Blog", "Conteúdo", "Tech"],
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    icon: "📝",
    prompt: "Blog de tecnologia com grid de artigos, sidebar com categorias e tags, barra de busca, artigo em destaque, newsletter signup e footer. Design escuro e clean.",
    color: "#06B6D4",
  },
  {
    id: "clinica",
    name: "Clínica Médica",
    description: "Site institucional para clínica com agendamento e serviços",
    tags: ["Saúde", "Clínica", "Institucional"],
    gradient: "from-teal-500 via-emerald-500 to-green-600",
    icon: "🏥",
    prompt: "Site institucional para clínica médica com hero de boas-vindas, seção de especialidades, equipe médica, agendamento online, depoimentos de pacientes e contato. Design profissional e acolhedor.",
    color: "#14B8A6",
  },
  {
    id: "restaurante",
    name: "Restaurante",
    description: "Site para restaurante com cardápio, reservas e galeria",
    tags: ["Restaurante", "Cardápio", "Local"],
    gradient: "from-orange-500 via-amber-500 to-yellow-600",
    icon: "🍽️",
    prompt: "Site para restaurante com hero gastronômico, cardápio interativo com categorias, galela de pratos, sistema de reservas, localização com mapa e contato. Design elegante escuro.",
    color: "#F59E0B",
  },
  {
    id: "fitness",
    name: "Fitness & Saúde",
    description: "Landing page para academia com planos e grade de aulas",
    tags: ["Fitness", "Academia", "Bem-estar"],
    gradient: "from-red-500 via-rose-500 to-pink-600",
    icon: "💪",
    prompt: "Landing page para academia/fitness com hero motivacional, grade de aulas, planos de assinatura, timeline de resultados, equipe de instrutores e contato. Design escuro energético.",
    color: "#E11D48",
  },
];

interface TemplateCardProps {
  template: Template;
  onClick: (prompt: string) => void;
  index?: number;
}

export default function TemplateCard({
  template,
  onClick,
  index = 0,
}: TemplateCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => onClick(template.prompt)}
      className="group relative text-left w-full"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-thiagobuild-gold/0 via-thiagobuild-gold/0 to-thiagobuild-gold/0 group-hover:from-thiagobuild-gold/15 group-hover:via-thiagobuild-gold/5 group-hover:to-thiagobuild-gold/15 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-[2px]" />

      <div className="relative overflow-hidden rounded-xl border border-thiagobuild-gold/10 bg-thiagobuild-surface/80 backdrop-blur-sm p-4 sm:p-5 transition-all duration-300 group-hover:border-thiagobuild-gold/25 group-hover:bg-thiagobuild-surface/90 group-hover:shadow-lg group-hover:shadow-thiagobuild-gold/10">
        {/* Gradient accent bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${template.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
        />

        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-thiagobuild-base/50 border border-thiagobuild-gold/10">
            {template.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold text-white group-hover:text-thiagobuild-gold transition-colors truncate">
                {template.name}
              </h3>
              <ArrowRight
                size={13}
                className="shrink-0 text-thiagobuild-gold/0 group-hover:text-thiagobuild-gold/60 transition-all group-hover:translate-x-0.5"
              />
            </div>
            <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors line-clamp-2 leading-relaxed">
              {template.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-medium uppercase tracking-wider bg-thiagobuild-gold/8 text-thiagobuild-gold/60 border border-thiagobuild-gold/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Preview indicator */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-thiagobuild-gold/8">
          <Sparkles size={10} className="text-thiagobuild-gold/40" />
          <span className="text-[10px] font-mono text-thiagobuild-gold/30">
            Clique para usar este template
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export { TEMPLATES };
