import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Exercicio } from '../../types';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function Exercicios() {
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });

  useEffect(() => {
    loadExercicios();
  }, []);

  const loadExercicios = async () => {
    try {
      const response = await api.get('/exercicio', {
        params: { page: 1, size: 100 }
      });
      setExercicios(response.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
      setExercicios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/exercicio/update/${editingId}`, formData);
      } else {
        await api.post('/exercicio', formData);
      }
      setShowModal(false);
      setFormData({ nome: '', descricao: '' });
      setEditingId(null);
      loadExercicios();
    } catch (error) {
      console.error('Erro ao salvar exercício:', error);
    }
  };

  const handleEdit = (exercicio: Exercicio) => {
    setEditingId(exercicio.id);
    setFormData({ nome: exercicio.nome, descricao: exercicio.descricao });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este exercício?')) return;
    try {
      await api.delete(`/exercicio/delete/${id}`);
      loadExercicios();
    } catch (error) {
      console.error('Erro ao excluir exercício:', error);
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ nome: '', descricao: '' });
    setShowModal(true);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Exercícios</h1>
        <Button onClick={openNewModal} className="flex items-center gap-2">
          <Plus size={20} />
          Novo Exercício
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Ações</TableHead>
        </TableHeader>
        <TableBody>
          {exercicios.map((ex) => (
            <TableRow key={ex.id}>
              <TableCell>{ex.nome}</TableCell>
              <TableCell>{ex.descricao}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(ex)}>
                    <Edit size={16} />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(ex.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {exercicios.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhum exercício cadastrado
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Editar Exercício' : 'Novo Exercício'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
          <Input
            label="Descrição"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            required
          />
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

