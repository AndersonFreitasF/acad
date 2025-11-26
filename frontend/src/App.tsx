import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neo-light font-base flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/login"
              element={
                <div className="p-12 text-center font-heading text-2xl">
                  LOGIN PAGE TODO
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="border-t-3 border-black bg-white p-6 text-center font-bold">
          <p>© 2025 NEO GYM. NO PAIN NO GAIN.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
