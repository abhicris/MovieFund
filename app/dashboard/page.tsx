import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-light text-black mb-12 tracking-tight">
            Dashboard
          </h1>
          
          <div className="border border-black p-8 text-center">
            <p className="text-sm font-light text-black mb-4">
              Dashboard coming soon
            </p>
            <p className="text-xs font-light text-black opacity-70">
              This feature is currently under development. You'll be able to track your investments, 
              view returns, and manage your portfolio here.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
