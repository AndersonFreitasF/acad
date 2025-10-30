import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Treino } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CompraModal } from '../../components/CompraModal';

export function Catalogo() {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTreino, setSelectedTreino] = useState<Treino | null>(null);

  useEffect(() => {
    loadCatalogo();
  }, []);

  const loadCatalogo = async () => {
    try {
      const response = await api.get('/treino/catalogo', {
        params: { page: 1, size: 100 }
      });
      setTreinos(response.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar catálogo:', error);
      setTreinos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Catálogo de Treinos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treinos.map((treino) => (
          <Card key={treino.id}>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {treino.titulo}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {treino.descricao}
            </p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-bold text-blue-500">
                R$ {Number(treino.preco).toFixed(2)}
              </span>
              <Button onClick={() => setSelectedTreino(treino)}>
                Comprar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {treinos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhum treino disponível no momento
        </div>
      )}

      {selectedTreino && (
        <CompraModal
          treino={selectedTreino}
          onClose={() => setSelectedTreino(null)}
          onSuccess={() => {
            setSelectedTreino(null);
            loadCatalogo();
          }}
        />
      )}
    </div>
  );
}

