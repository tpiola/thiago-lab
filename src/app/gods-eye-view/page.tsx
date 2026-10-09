import type { Metadata } from 'next';
import { GlobeWorkspace } from '@/components/gods-eye-view/GlobeWorkspace';

export const metadata: Metadata = {
  title: "God's Eye View | Thiago Lab",
  description: 'Explore Franca e o mundo em um globo interativo com dados públicos de voos, satélites, clima e terremotos.',
  alternates: { canonical: '/gods-eye-view', languages: { 'pt-BR': '/gods-eye-view' } },
  openGraph: { title: "God's Eye View | Thiago Lab", url: '/gods-eye-view', description: 'Exploração geoespacial com dados públicos.' },
};

export default function GodsEyeViewPage() { return <GlobeWorkspace />; }
