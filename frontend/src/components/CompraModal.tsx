import { useState } from 'react';
import { api } from '../api/client';
import { Treino, PixResponse, CardResponse } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { CreditCard, QrCode, Copy, CheckCircle } from 'lucide-react';

interface CompraModalProps {
  treino: Treino;
  onClose: () => void;
  onSuccess: () => void;
}

export function CompraModal({ treino, onClose, onSuccess }: CompraModalProps) {
  const [metodo, setMetodo] = useState<'PIX' | 'CREDIT_CARD' | null>(null);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [cardSuccess, setCardSuccess] = useState(false);
  const [error, setError] = useState('');

  const [cardData, setCardData] = useState({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: '',
    name: '',
    email: '',
    cpfCnpj: '',
  });

  const handlePixPayment = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/pagamento/compra', {
        treinoId: treino.id,
        metodo: 'PIX',
      });
      setPixData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao gerar pagamento PIX');
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/pagamento/compra', {
        treinoId: treino.id,
        metodo: 'CREDIT_CARD',
        card: {
          holderName: cardData.holderName,
          number: cardData.number.replace(/\s/g, ''),
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          ccv: cardData.ccv,
        },
        holderInfo: {
          name: cardData.name,
          email: cardData.email,
          cpfCnpj: cardData.cpfCnpj.replace(/\D/g, ''),
        },
      });
      setCardSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!metodo) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Escolha a forma de pagamento">
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold">{treino.titulo}</h3>
            <p className="text-2xl font-bold text-blue-500 mt-2">
              R$ {Number(treino.preco).toFixed(2)}
            </p>
          </div>

          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setMetodo('PIX')}
          >
            <QrCode size={20} />
            Pagar com PIX
          </Button>

          <Button
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setMetodo('CREDIT_CARD')}
          >
            <CreditCard size={20} />
            Pagar com Cartão de Crédito
          </Button>
        </div>
      </Modal>
    );
  }

  if (metodo === 'PIX') {
    return (
      <Modal isOpen={true} onClose={onClose} title="Pagamento PIX" size="lg">
        {!pixData ? (
          <div className="text-center space-y-4">
            <p className="text-lg">
              Valor: <span className="font-bold text-blue-500">R$ {Number(treino.preco).toFixed(2)}</span>
            </p>
            <Button onClick={handlePixPayment} disabled={loading} className="w-full">
              {loading ? 'Gerando QR Code...' : 'Gerar QR Code PIX'}
            </Button>
            {error && <p className="text-red-600">{error}</p>}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-600">Escaneie o QR Code ou copie o código PIX</p>
            <img
              src={pixData.qrCodeImage}
              alt="QR Code PIX"
              className="mx-auto max-w-xs"
            />
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm break-all">{pixData.copyPaste}</p>
            </div>
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => copyToClipboard(pixData.copyPaste)}
            >
              <Copy size={18} />
              Copiar código PIX
            </Button>
            <p className="text-sm text-gray-600">
              Após o pagamento, o acesso ao treino será liberado automaticamente.
            </p>
          </div>
        )}
      </Modal>
    );
  }

  if (metodo === 'CREDIT_CARD') {
    if (cardSuccess) {
      return (
        <Modal isOpen={true} onClose={onClose} title="Pagamento Aprovado">
          <div className="text-center py-8 space-y-4">
            <CheckCircle size={64} className="mx-auto text-green-500" />
            <h3 className="text-xl font-semibold text-green-600">
              Pagamento aprovado com sucesso!
            </h3>
            <p className="text-gray-600">O treino já está disponível para você.</p>
          </div>
        </Modal>
      );
    }

    return (
      <Modal isOpen={true} onClose={onClose} title="Pagamento com Cartão" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleCardPayment(); }} className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="font-semibold">Total: R$ {Number(treino.preco).toFixed(2)}</p>
          </div>

          <h4 className="font-semibold text-gray-900">Dados do Cartão</h4>
          <Input
            label="Nome no Cartão"
            value={cardData.holderName}
            onChange={(e) => setCardData({ ...cardData, holderName: e.target.value })}
            required
          />
          <Input
            label="Número do Cartão"
            value={cardData.number}
            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
            placeholder="0000 0000 0000 0000"
            required
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Mês"
              value={cardData.expiryMonth}
              onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value })}
              placeholder="MM"
              maxLength={2}
              required
            />
            <Input
              label="Ano"
              value={cardData.expiryYear}
              onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value })}
              placeholder="YYYY"
              maxLength={4}
              required
            />
            <Input
              label="CVV"
              value={cardData.ccv}
              onChange={(e) => setCardData({ ...cardData, ccv: e.target.value })}
              placeholder="123"
              maxLength={4}
              required
            />
          </div>

          <h4 className="font-semibold text-gray-900 mt-6">Dados do Titular</h4>
          <Input
            label="Nome Completo"
            value={cardData.name}
            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={cardData.email}
            onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
            required
          />
          <Input
            label="CPF/CNPJ"
            value={cardData.cpfCnpj}
            onChange={(e) => setCardData({ ...cardData, cpfCnpj: e.target.value })}
            placeholder="000.000.000-00"
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processando...' : 'Finalizar Pagamento'}
          </Button>
        </form>
      </Modal>
    );
  }

  return null;
}

