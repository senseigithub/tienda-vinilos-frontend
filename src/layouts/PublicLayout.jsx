import Navbar from "../components/Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-4 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
