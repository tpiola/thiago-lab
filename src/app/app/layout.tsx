/* ── /app Layout — Workspace sidebar layout
   No Nav, No Footer, No GoldParticles
   Design escuro #06080C
   ========================================================================== */

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#06080C] text-[#E8EDF2]">
      {children}
    </div>
  );
}
