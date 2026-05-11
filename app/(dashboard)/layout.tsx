import Sidebar from "@/app/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh bg-gray-50">
      {/* Sidebar solo se muestra en desktop desde acá.
          En mobile el drawer lo maneja el Topbar internamente. */}
      <Sidebar open={false} onClose={() => {}} />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
