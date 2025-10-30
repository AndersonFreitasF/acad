import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Home, Dumbbell, ShoppingCart, Users, GraduationCap, LayoutDashboard } from 'lucide-react';

export function Sidebar() {
  const user = useAuthStore((state) => state.user);

  const getLinks = () => {
    if (!user) return [];

    switch (user.tipo) {
      case 'ALUNO':
        return [
          { to: '/aluno', icon: Home, label: 'Dashboard' },
          { to: '/aluno/catalogo', icon: ShoppingCart, label: 'Catálogo' },
          { to: '/aluno/meus-treinos', icon: Dumbbell, label: 'Meus Treinos' },
        ];
      case 'PROFESSOR':
        return [
          { to: '/professor', icon: Home, label: 'Dashboard' },
          { to: '/professor/exercicios', icon: Dumbbell, label: 'Exercícios' },
          { to: '/professor/treinos', icon: GraduationCap, label: 'Meus Treinos' },
        ];
      case 'ADM':
        return [
          { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/admin/usuarios', icon: Users, label: 'Usuários' },
          { to: '/admin/professores', icon: GraduationCap, label: 'Professores' },
          { to: '/admin/treinos', icon: Dumbbell, label: 'Treinos' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-500">Academia</h1>
        <p className="text-sm text-gray-600 mt-1">{user?.tipo}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

