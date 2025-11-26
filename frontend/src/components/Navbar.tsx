import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="border-b-3 border-black bg-white py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
      <Link
        to="/"
        className="text-2xl font-heading uppercase tracking-tighter hover:text-neo-blue transition-colors"
      >
        NEO GYM
      </Link>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6 font-bold text-sm">
          <Link
            to="/catalog"
            className="hover:underline decoration-2 underline-offset-4"
          >
            CATALOGO
          </Link>
          <Link
            to="/dashboard"
            className="hover:underline decoration-2 underline-offset-4"
          >
            DASHBOARD
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex"
            >
              LOGIN
            </Button>
          </Link>
          <Button size="sm" className="bg-neo-blue text-white">
            INSCREVER-SE
          </Button>
        </div>
      </div>
    </nav>
  );
}
