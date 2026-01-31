import TutorSidebar from "@/components/tutor/tutor-sidebar";

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">

      <aside className="hidden md:block">
        <TutorSidebar />
      </aside>


      <div className="flex-1 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
