import { Card } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { Dumbbell, GraduationCap } from 'lucide-react';

export function ProfessorDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/professor/exercicios">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Dumbbell className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Exercícios</h3>
                <p className="text-gray-600">Gerencie exercícios</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/professor/treinos">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <GraduationCap className="text-green-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Meus Treinos</h3>
                <p className="text-gray-600">Gerencie seus treinos</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

