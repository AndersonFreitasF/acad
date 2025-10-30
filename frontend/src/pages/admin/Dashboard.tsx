import { Card } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, Dumbbell } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/usuarios">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Usuários</h3>
                <p className="text-gray-600">Gerencie usuários</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/admin/professores">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <GraduationCap className="text-green-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Professores</h3>
                <p className="text-gray-600">Gerencie professores</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/admin/treinos">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Dumbbell className="text-purple-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Treinos</h3>
                <p className="text-gray-600">Visualize treinos</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

