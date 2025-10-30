import { Card } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { ShoppingCart, Dumbbell } from 'lucide-react';

export function AlunoDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/aluno/catalogo">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Catálogo de Treinos</h3>
                <p className="text-gray-600">Compre novos treinos</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/aluno/meus-treinos">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Dumbbell className="text-green-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Meus Treinos</h3>
                <p className="text-gray-600">Veja seus treinos</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

