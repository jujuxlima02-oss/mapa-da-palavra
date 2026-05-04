"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { Copy, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Timer } from "@/components/ui/Timer";
import { analytics } from "@/lib/analytics";
import { PRODUCT } from "@/lib/constants";

interface PixPaymentProps {
  orderId: string;
  pixCopyPaste: string;
  pixExpiresAt: Date;
  offerSource: string;
  shippingDeadline: string;
  isAlreadyExpired?: boolean;
}

export function PixPayment({
  orderId,
  pixCopyPaste,
  pixExpiresAt,
  offerSource,
  shippingDeadline,
  isAlreadyExpired = false,
}: PixPaymentProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isExpired, setIsExpired] = useState(isAlreadyExpired);

  useEffect(() => {
    // GA4 Event - PIX gerado (apenas se for um PIX fresco)
    if (!isAlreadyExpired) {
      analytics.pixGenerated(offerSource, orderId, PRODUCT.priceCents);
    }
  }, [offerSource, orderId, isAlreadyExpired]);

  // Polling mechanism (Tarefa 18)
  useEffect(() => {
    if (isExpired) return;

    const checkOrderStatus = async () => {
      try {
        const response = await fetch(`/api/order/${orderId}`);
        if (!response.ok) return;

        const data = await response.json();

        if (data.status === "PAID") {
          // Quando pago, rotear para página de confirmação
          router.push(`/checkout/confirmacao/${orderId}`);
        } else if (data.status === "EXPIRED") {
           // Reflete API webhook (remoto) de que o pagamento já venceu
          setIsExpired(true);
        }
      } catch (err) {
        console.error("Erro no polling de pagamento", err);
      }
    };

    const intervalId = setInterval(checkOrderStatus, 5000);

    return () => clearInterval(intervalId);
  }, [orderId, isExpired, router]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCopyPaste);
      setCopied(true);
      analytics.pixCodeCopied(orderId);
      
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Falha ao copiar ao clipboard", err);
    }
  };

  const handleExpired = () => {
    setIsExpired(true);
  };

  const retryCheckout = () => {
    router.push(`/checkout?offer=${offerSource}`);
  };

  if (isExpired) {
    return (
      <div className="bg-[var(--color-surface-2)] rounded-xl shadow-sm border border-[var(--color-error)]/20 p-8 text-center space-y-6 max-w-lg w-full mx-auto">
        <div className="w-16 h-16 bg-[var(--color-error)]/10 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">PIX expirado</h2>
          <p className="text-[var(--color-text-muted)] mt-2">
            O prazo terminou. Gere um novo PIX para continuar sua compra com segurança.
          </p>
        </div>

        <Button onClick={retryCheckout} size="lg" className="w-full h-14 text-lg mt-4">
          <RefreshCw className="mr-2 w-5 h-5" />
          Gerar novo código e retomar minha jornada
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface-2)] rounded-xl shadow-sm border border-[var(--color-border)] p-6 lg:p-10 w-full max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Seu PIX está pronto. Escaneie o código e confirme sua decisão.</h2>
        <p className="text-[var(--color-text-muted)] mt-2">Siga os passos abaixo e conclua seu pedido do {PRODUCT.name} com confiança.</p>
        
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Expira em</span>
          <Timer expiresAt={pixExpiresAt} onExpired={handleExpired} />
        </div>
        <div className="relative mx-auto mt-6 h-16 w-16 overflow-hidden rounded-lg bg-[var(--color-surface)] ring-1 ring-[var(--color-border)]">
          {/* TODO: substituir por asset final do Nanobanana — Briefing 11: Micro mockup PIX // PLACEHOLDER */}
          <Image
            src="/assets/imagem-produto.png"
            alt={`Miniatura do ${PRODUCT.name} com selo visual de pedido reservado`}
            width={64}
            height={64}
            sizes="64px"
            style={{ aspectRatio: "1 / 1" }}
            className="object-cover"
          />
        </div>
        <p className="mx-auto mt-4 max-w-md text-sm text-[var(--color-text-muted)]">
          Seu pedido será processado assim que o pagamento for confirmado. Prazo de entrega: {shippingDeadline}.
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm font-medium text-[var(--color-primary)]">
          Assim que o pagamento for confirmado, sua jornada com a Palavra começa.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">
        {/* QR Code Section */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] min-w-[300px]">
          <div className="bg-[var(--color-surface-2)] p-4 rounded-xl shadow-sm">
            <QRCodeSVG value={pixCopyPaste} size={220} marginSize={2} level="M" />
          </div>
          <p className="text-xs text-[var(--color-text-faint)] mt-4 max-w-[220px] text-center">
            Aponte a câmera do aplicativo bancário para o QR Code.
          </p>
        </div>

        {/* Copy Paste Code Section */}
        <div className="flex-1 flex flex-col items-start w-full space-y-6">
          <div className="space-y-4 w-full">
            <h3 className="font-semibold text-[var(--color-text)] text-lg flex items-center gap-2">
              <span className="bg-[var(--color-primary-highlight)] text-[var(--color-success)] w-6 h-6 flex items-center justify-center rounded-full text-xs">Ou</span>
              Copie e cole o código PIX
            </h3>
            
            <p className="text-sm text-[var(--color-text-muted)]">
              1. Abra o aplicativo do banco<br/>
              2. Escolha pagar via &quot;Pix copia e cola&quot;<br/>
              3. Cole o código abaixo e conclua o pagamento.
            </p>

            <div className="w-full">
              <input
                type="text"
                readOnly
                value={pixCopyPaste}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] text-sm rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] block p-3 pr-10 truncate"
              />
            </div>
          </div>

          <Button 
            onClick={handleCopy} 
            size="lg" 
            className={`w-full h-14 text-white text-lg font-bold shadow-md transition-colors duration-300 ${
              copied ? "bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 shadow-[0_10px_20px_rgba(74,124,63,0.18)]" : ""
            }`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-6 h-6 mr-2" /> Copiado! ✓
              </>
            ) : (
              <>
                <Copy className="w-6 h-6 mr-2" /> Copiar Código
              </>
            )}
          </Button>
          
            <p className="text-[11px] text-center text-[var(--color-success)] w-full bg-[var(--color-primary-highlight)]/40 py-2 rounded-lg font-medium border border-[var(--color-border)]">
            A aprovação costuma acontecer em instantes.
            </p>
        </div>
      </div>
    </div>
  );
}
