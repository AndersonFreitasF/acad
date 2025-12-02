import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { authService } from "../services/auth";
import { paymentService, PurchaseTrainingData } from "../services/payment";
import { Training } from "../services/training";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Loader2, CreditCard, QrCode, CheckCircle, Copy } from "lucide-react";

export function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const training = state?.training as Training | undefined;

  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"CREDIT_CARD" | "PIX">("CREDIT_CARD");
  const [successData, setSuccessData] = useState<any>(null);

  const [cardData, setCardData] = useState({
    number: "",
    holderName: "",
    expiryMonth: "",
    expiryYear: "",
    ccv: "",
  });

  const [holderInfo, setHolderInfo] = useState({
    name: "",
    email: "",
    cpfCnpj: "",
    postalCode: "",
    addressNumber: "",
    phone: "",
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }
    if (!training) {
      navigate("/catalog");
    }
  }, [navigate, training]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!training) return;

    setLoading(true);
    try {
      const payload: PurchaseTrainingData = {
        treinoId: training.id,
        metodo: method,
      };

      if (method === "CREDIT_CARD") {
        payload.card = cardData;
        payload.holderInfo = holderInfo;
      }

      const response = await paymentService.purchaseTraining(payload);
      setSuccessData(response);
    } catch (error) {
      console.error("Pagamento falhou", error);
      alert("Falha no pagamento. Verifique seus dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-neo-green bg-neo-green/10">
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-4 text-center">
              <CheckCircle className="w-16 h-16 text-neo-green" />
              <span>PEDIDO CONFIRMADO!</span>
            </CardTitle>
            <CardDescription className="text-center text-black dark:text-white">
              {method === "CREDIT_CARD"
                ? "Sua compra foi realizada com sucesso."
                : "Escaneie o QR Code abaixo para pagar."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {method === "PIX" && successData.qrCodeImage && (
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={`data:image/jpeg;base64,${successData.qrCodeImage}`}
                  alt="PIX QR Code"
                  className="w-48 h-48 border-2 border-black rounded-base"
                />
                <div className="w-full flex gap-2">
                  <Input value={successData.copyPaste} readOnly />
                  <Button
                    size="icon"
                    onClick={() =>
                      navigator.clipboard.writeText(successData.copyPaste)
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            <Button className="w-full" onClick={() => navigate("/dashboard")}>
              IR PARA O DASHBOARD
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!training) return null;

  return (
    <div className="space-y-8 py-8 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-heading text-black dark:text-white">
        CHECKOUT
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setMethod("CREDIT_CARD")}
                  className={`p-4 border-3 rounded-base flex flex-col items-center gap-2 font-bold transition-all ${
                    method === "CREDIT_CARD"
                      ? "border-neo-blue bg-neo-blue/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-black"
                  }`}
                >
                  <CreditCard className="w-8 h-8" />
                  CARTÃO DE CRÉDITO
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("PIX")}
                  className={`p-4 border-3 rounded-base flex flex-col items-center gap-2 font-bold transition-all ${
                    method === "PIX"
                      ? "border-neo-green bg-neo-green/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-black"
                  }`}
                >
                  <QrCode className="w-8 h-8" />
                  PIX
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {method === "CREDIT_CARD" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="space-y-2">
                      <Label>Número do Cartão</Label>
                      <Input
                        value={cardData.number}
                        onChange={(e) =>
                          setCardData({ ...cardData, number: e.target.value })
                        }
                        placeholder="0000 0000 0000 0000"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Mês de Validade</Label>
                        <Input
                          value={cardData.expiryMonth}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              expiryMonth: e.target.value,
                            })
                          }
                          placeholder="MM"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ano de Validade</Label>
                        <Input
                          value={cardData.expiryYear}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              expiryYear: e.target.value,
                            })
                          }
                          placeholder="AAAA"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input
                          value={cardData.ccv}
                          onChange={(e) =>
                            setCardData({ ...cardData, ccv: e.target.value })
                          }
                          placeholder="123"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nome no Cartão</Label>
                        <Input
                          value={cardData.holderName}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              holderName: e.target.value,
                            })
                          }
                          placeholder="NOME COMO NO CARTÃO"
                          required
                        />
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-gray-200 my-4 pt-4 space-y-4">
                      <h4 className="font-bold">Informações de Cobrança</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Nome Completo"
                          value={holderInfo.name}
                          onChange={(e) =>
                            setHolderInfo({
                              ...holderInfo,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={holderInfo.email}
                          onChange={(e) =>
                            setHolderInfo({
                              ...holderInfo,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                        <Input
                          placeholder="CPF/CNPJ"
                          value={holderInfo.cpfCnpj}
                          onChange={(e) =>
                            setHolderInfo({
                              ...holderInfo,
                              cpfCnpj: e.target.value,
                            })
                          }
                          required
                        />
                        <Input
                          placeholder="Telefone"
                          value={holderInfo.phone}
                          onChange={(e) =>
                            setHolderInfo({
                              ...holderInfo,
                              phone: e.target.value,
                            })
                          }
                          required
                        />
                        <Input
                          placeholder="CEP"
                          value={holderInfo.postalCode}
                          onChange={(e) =>
                            setHolderInfo({
                              ...holderInfo,
                              postalCode: e.target.value,
                            })
                          }
                          required
                        />
                        <Input
                          placeholder="Número do Endereço"
                          value={holderInfo.addressNumber}
                          onChange={(e) =>
                            setHolderInfo({
                              ...holderInfo,
                              addressNumber: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full text-lg h-14"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    `PAGAR R$ ${Number(training.preco).toFixed(2)}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <div className="md:col-span-1">
          <Card className="bg-gray-50 dark:bg-gray-800 sticky top-24">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Treino</p>
                <p className="font-bold text-lg">{training.titulo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Descrição</p>
                <p className="text-sm">{training.descricao}</p>
              </div>
              <div className="border-t-2 border-black/10 pt-4 flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="font-heading text-2xl text-neo-green">
                  R$ {Number(training.preco).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
