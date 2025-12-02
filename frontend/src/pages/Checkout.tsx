import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { authService } from "../services/auth";
import { paymentService, PurchaseTrainingData } from "../services/payment";
import { Training } from "../services/training";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, CreditCard, QrCode, CheckCircle, Copy, ShoppingCart, ArrowLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";

export function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const training = state?.training as Training | undefined;

  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"CREDIT_CARD" | "PIX">("CREDIT_CARD");
  const [successData, setSuccessData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(successData.copyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30 dark:opacity-10" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-neo-green border-4 border-black rounded-base shadow-neo-lg overflow-hidden">
            <div className="p-8 text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto shadow-neo"
              >
                <CheckCircle className="w-12 h-12 text-neo-green" />
              </motion.div>
              <div>
                <h2 className="text-4xl font-heading mb-2">PEDIDO CONFIRMADO!</h2>
                <p className="font-medium">
                  {method === "CREDIT_CARD"
                    ? "Sua compra foi realizada com sucesso."
                    : "Escaneie o QR Code abaixo para pagar."}
                </p>
              </div>

              {method === "PIX" && successData.qrCodeImage && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-base border-4 border-black inline-block">
                    <img
                      src={`data:image/jpeg;base64,${successData.qrCodeImage}`}
                      alt="PIX QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={successData.copyPaste}
                      readOnly
                      className="border-4 border-black rounded-base bg-white font-mono text-sm"
                    />
                    <Button
                      onClick={handleCopy}
                      className={`px-4 border-4 border-black ${copied ? "bg-neo-green" : "bg-white"} text-black shadow-neo-sm hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]`}
                    >
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-sm font-bold">Codigo copiado!</p>
                  )}
                </div>
              )}

              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full h-14 bg-black text-white border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[-4px] hover:translate-y-[-4px] font-bold text-lg"
              >
                IR PARA O DASHBOARD
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!training) return null;

  return (
    <div className="min-h-[calc(100vh-180px)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-diagonal opacity-30 dark:opacity-10" />

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <button
              onClick={() => navigate("/catalog")}
              className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao catálogo
            </button>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neo-blue text-white border-4 border-black rounded-base shadow-neo-sm font-bold text-sm">
              <ShoppingCart className="w-4 h-4" />
              CHECKOUT
            </div>
            <h1 className="text-5xl md:text-6xl font-heading text-black dark:text-white">
              FINALIZAR COMPRA
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-base shadow-neo overflow-hidden">
                {/* Payment Method */}
                <div className="p-6 border-b-4 border-black dark:border-white">
                  <h2 className="text-xl font-heading mb-4">METODO DE PAGAMENTO</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setMethod("CREDIT_CARD")}
                      className={`p-6 border-4 rounded-base flex flex-col items-center gap-3 font-bold transition-all
                        ${method === "CREDIT_CARD"
                          ? "border-neo-blue bg-neo-blue/10 shadow-neo-blue"
                          : "border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                    >
                      <CreditCard className="w-10 h-10" />
                      <span>CARTÃO DE CRÉDITO</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod("PIX")}
                      className={`p-6 border-4 rounded-base flex flex-col items-center gap-3 font-bold transition-all
                        ${method === "PIX"
                          ? "border-neo-green bg-neo-green/10 shadow-neo-green"
                          : "border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                    >
                      <QrCode className="w-10 h-10" />
                      <span>PIX</span>
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {method === "CREDIT_CARD" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-6"
                    >
                      {/* Card Data */}
                      <div className="space-y-4">
                        <h3 className="font-bold uppercase text-sm text-gray-500">Dados do Cartao</h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="font-bold text-sm">Numero do Cartao</Label>
                            <Input
                              value={cardData.number}
                              onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                              placeholder="0000 0000 0000 0000"
                              required
                              className="border-4 border-black rounded-base h-12"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label className="font-bold text-sm">Mes</Label>
                              <Input
                                value={cardData.expiryMonth}
                                onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value })}
                                placeholder="MM"
                                required
                                className="border-4 border-black rounded-base h-12"
                              />
                            </div>
                            <div>
                              <Label className="font-bold text-sm">Ano</Label>
                              <Input
                                value={cardData.expiryYear}
                                onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value })}
                                placeholder="AAAA"
                                required
                                className="border-4 border-black rounded-base h-12"
                              />
                            </div>
                            <div>
                              <Label className="font-bold text-sm">CVV</Label>
                              <Input
                                value={cardData.ccv}
                                onChange={(e) => setCardData({ ...cardData, ccv: e.target.value })}
                                placeholder="123"
                                required
                                className="border-4 border-black rounded-base h-12"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="font-bold text-sm">Nome no Cartao</Label>
                            <Input
                              value={cardData.holderName}
                              onChange={(e) => setCardData({ ...cardData, holderName: e.target.value })}
                              placeholder="NOME COMO NO CARTÃO"
                              required
                              className="border-4 border-black rounded-base h-12"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Billing Info */}
                      <div className="space-y-4 border-t-4 border-dashed border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="font-bold uppercase text-sm text-gray-500">Informacoes de Cobranca</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="Nome Completo"
                            value={holderInfo.name}
                            onChange={(e) => setHolderInfo({ ...holderInfo, name: e.target.value })}
                            required
                            className="border-4 border-black rounded-base h-12"
                          />
                          <Input
                            placeholder="Email"
                            type="email"
                            value={holderInfo.email}
                            onChange={(e) => setHolderInfo({ ...holderInfo, email: e.target.value })}
                            required
                            className="border-4 border-black rounded-base h-12"
                          />
                          <Input
                            placeholder="CPF/CNPJ"
                            value={holderInfo.cpfCnpj}
                            onChange={(e) => setHolderInfo({ ...holderInfo, cpfCnpj: e.target.value })}
                            required
                            className="border-4 border-black rounded-base h-12"
                          />
                          <Input
                            placeholder="Telefone"
                            value={holderInfo.phone}
                            onChange={(e) => setHolderInfo({ ...holderInfo, phone: e.target.value })}
                            required
                            className="border-4 border-black rounded-base h-12"
                          />
                          <Input
                            placeholder="CEP"
                            value={holderInfo.postalCode}
                            onChange={(e) => setHolderInfo({ ...holderInfo, postalCode: e.target.value })}
                            required
                            className="border-4 border-black rounded-base h-12"
                          />
                          <Input
                            placeholder="Numero"
                            value={holderInfo.addressNumber}
                            onChange={(e) => setHolderInfo({ ...holderInfo, addressNumber: e.target.value })}
                            required
                            className="border-4 border-black rounded-base h-12"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {method === "PIX" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 bg-neo-green border-4 border-black rounded-base mx-auto mb-4 flex items-center justify-center">
                        <QrCode className="w-10 h-10" />
                      </div>
                      <p className="font-medium text-gray-600 dark:text-gray-400">
                        Ao clicar em pagar, um QR Code será gerado para você realizar o pagamento via PIX.
                      </p>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 text-xl font-bold bg-neo-green text-black border-4 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      `PAGAR R$ ${Number(training.preco).toFixed(2)}`
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    Pagamento seguro processado por Asaas
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-neo-yellow border-4 border-black rounded-base shadow-neo sticky top-24">
                <div className="p-6 border-b-4 border-black">
                  <h2 className="text-xl font-heading">RESUMO DO PEDIDO</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-sm font-bold uppercase text-black/60">Treino</p>
                    <p className="text-2xl font-heading">{training.titulo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase text-black/60">Descricao</p>
                    <p className="text-sm font-medium">{training.descricao || "Sem descrição"}</p>
                  </div>
                  <div className="border-t-4 border-black pt-6">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total</span>
                      <span className="text-4xl font-heading">
                        R$ {Number(training.preco).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
