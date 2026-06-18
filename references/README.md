# 📚 Referências de Pattern Design & Desenvolvimento Web

## Design Systems & UI Libraries

### shadcn/ui (mais estrelado)
- **URL**: https://github.com/shadcn-ui/ui
- **Stack**: React + Tailwind CSS + Radix UI
- **Destaque**: Componentes copiáveis, não dependência
- **Pattern**: `className` com `cn()` via `tailwind-merge` + `clsx`

### Radix UI
- **URL**: https://github.com/radix-ui/primitives
- **Stack**: React Headless UI
- **Destaque**: Acessibilidade WAI-ARIA, composição via slots

### Tailwind CSS v4
- **URL**: https://github.com/tailwindlabs/tailwindcss
- **Stack**: Utility-first CSS
- **Destaque**: `@theme inline` para design tokens, CSS-first config

## AI & LLM Patterns

### OmniRoute Gateway
- **URL**: http://localhost:20128
- **Endpoint**: `/v1/chat/completions`
- **Formato**: Compatível com OpenAI API
- **Modelo padrão**: `oc/deepseek-v4-flash-free`
- **Fallback**: OpenAI API (`OPENAI_API_KEY`)

### Prompt Engineering Pattern
```typescript
// System prompt + user message
// JSON mode com validação de schema
// Retry com fallback de modelo
```

## Data Fetching

### Server Components (Next.js 16)
```typescript
// Async server component com fetch direto
async function Page() {
  const data = await fetch('https://api.exemplo.com').then(r => r.json());
  return <Component data={data} />;
}
```

### Client Components
```typescript
'use client';
// useState + useEffect para fetching
// useSWR ou TanStack Query para caching
```

## Component Architecture (thiagolab.com)

### Intelligence OS Pattern
```typescript
'use client';
// 1. Imports (lucide-react, recharts, etc.)
// 2. Types/Interfaces
// 3. Mock Data (const DATA = [...])
// 4. Sub-components
// 5. Main component export default
// 6. Classes: intelligence-os-card, intelligence-os-btn-primary, etc.
```

## Design Tokens
```css
/* Cores Navy/Gold */
--primary: #C9A227;
--primary-light: rgba(201,162,39,0.1);
--bg-dark: #050D1A;
--bg-surface: #0C0F15;
--text-primary: #E8EDF2;
--text-secondary: #6B7280;
```

## Styles & Animation Patterns

### Card Pattern
```tsx
<div className="intelligence-os-card p-4 hover:border-[rgba(201,162,39,0.15)] transition-all duration-200">
```

### Button Pattern
```tsx
<button className="intelligence-os-btn-primary inline-flex items-center gap-1.5">
<button className="intelligence-os-btn-outline inline-flex items-center gap-1.5">
```

### Section Header Pattern
```tsx
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
  <div>
    <h1 className="intelligence-os-section-title text-2xl">Título</h1>
    <p className="intelligence-os-section-subtitle mt-1">Subtítulo</p>
  </div>
  <button className="intelligence-os-btn-primary">Ação</button>
</div>
```

### Metric Card Pattern
```tsx
<div className="intelligence-os-metric">
  <div className="flex items-center gap-2 mb-2">
    <Icon size={14} className="text-[#C9A227]" />
    <span className="intelligence-os-metric-label" style={{ margin: 0 }}>Label</span>
  </div>
  <div className="intelligence-os-metric-value text-xl">Value</div>
</div>
```

## Tailwind v4 Specific Patterns

### Custom Theme Colors
```css
@theme inline {
  --color-navy: #050D1A;
  --color-gold: #C9A227;
  --color-surface: #0C0F15;
}
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Glass Effect
```css
.intelligence-os-glass {
  background: rgba(12, 15, 21, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(201, 162, 39, 0.06);
}
```

## Typescript Patterns

### Safe JSON Parse
```typescript
function extractJSON(text: string): Record<string, unknown> | null {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text;
  try { return JSON.parse(jsonStr.trim()); } catch { return null; }
}
```

### Type-safe fetch
```typescript
async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```
