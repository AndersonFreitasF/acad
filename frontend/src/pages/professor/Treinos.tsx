import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Treino } from '../../types';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function Treinos() {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTreinos();
  }, []);

  const loadTreinos = async () => {
    try {
      const response = await api.get('/treino', {
        params: { page: 1, size: 100 }
      });
      setTreinos(response.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
      setTreinos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este treino?')) return;
    try {
      await api.delete(`/treino/delete/${id}`);
      loadTreinos();
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Meus Treinos</h1>
        <Button className="flex items-center gap-2">
          <Plus size={20} />
          Novo Treino
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableHead>Título</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Ações</TableHead>
        </TableHeader>
        <TableBody>
          {treinos.map((treino) => (
            <TableRow key={treino.id}>
              <TableCell>{treino.titulo}</TableCell>
              <TableCell>{treino.descricao}</TableCell>
              <TableCell>R$ {Number(treino.preco).toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Edit size={16} />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(treino.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {treinos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhum treino cadastrado
        </div>
      )}
    </div>
  );
}

