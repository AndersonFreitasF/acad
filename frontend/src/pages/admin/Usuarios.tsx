import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { User } from '../../types';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    nome: '', 
    email: '', 
    senha: '', 
    tipo: 'ALUNO' as 'ALUNO' | 'PROFESSOR' | 'ADM' 
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const response = await api.get('/usuario', {
        params: { page: 1, size: 100 }
      });
      setUsuarios(response.data.Usuarios || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/usuario/update/${editingId}`, formData);
      } else {
        await api.post('/usuario', formData);
      }
      setShowModal(false);
      setFormData({ nome: '', email: '', senha: '', tipo: 'ALUNO' });
      setEditingId(null);
      loadUsuarios();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleEdit = (usuario: User) => {
    setEditingId(usuario.id_usuario);
    setFormData({ nome: usuario.nome, email: usuario.email, senha: '', tipo: usuario.tipo });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este usuário?')) return;
    try {
      await api.delete(`/usuario/delete/${id}`);
      loadUsuarios();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ nome: '', email: '', senha: '', tipo: 'ALUNO' });
    setShowModal(true);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
        <Button onClick={openNewModal} className="flex items-center gap-2">
          <Plus size={20} />
          Novo Usuário
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Ações</TableHead>
        </TableHeader>
        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.id_usuario}>
              <TableCell>{usuario.nome}</TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  usuario.tipo === 'ADM' ? 'bg-purple-100 text-purple-800' :
                  usuario.tipo === 'PROFESSOR' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {usuario.tipo}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(usuario)}>
                    <Edit size={16} />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(usuario.id_usuario)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Editar Usuário' : 'Novo Usuário'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Senha"
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            required={!editingId}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="ALUNO">Aluno</option>
              <option value="PROFESSOR">Professor</option>
              <option value="ADM">Admin</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Salvar</Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

