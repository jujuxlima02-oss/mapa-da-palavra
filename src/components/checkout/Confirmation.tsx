"use client";

import { useEffect } from "react";
import Image from "next/image";
import { analytics } from "@/lib/analytics";
import { PRODUCT } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";
import confirmationImage from "../../../public/assets/imagem_mapa_palavra2.jpeg"; // TODO: substituir pela imagem correta

interface ConfirmationProps {
  orderId: string;
  customerName: string;
  productName: string;
  amountCents: number;
  paidAt: Date;
  offerSource: string;
  shippingDeadline: string;
}

export function Confirmation({
  orderId,
  customerName,
  productName,
  amountCents,
  paidAt,
  offerSource,
  shippingDeadline,
}: ConfirmationProps) {
  
  useEffect(() => {
    analytics.trackEvent("purchase", {
      offer_source: offerSource,
      order_id: orderId,
      value: amountCents / 100,
      currency: "BRL",
      transaction_id: orderId,
    });
  }, [offerSource, amountCents, orderId]);

  const firstName = customerName.split(" ")[0];

  return (
    <div className="bg-[var(--color-surface-2)] rounded-2xl shadow-sm border border-[var(--color-border)] p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-[var(--color-surface)] ring-1 ring-[var(--color-border)]">
        {/* TODO: substituir por asset final do Nanobanana — Briefing 12: Mockup comemorativo confirmação // PLACEHOLDER */}
        <Image
          src="/assets/pagamento-confirmado.png"
          alt="Guia Mapa da Palavra em apresentação comemorativa de pedido confirmado"
          width={448}
          height={336}
          sizes="(max-width: 768px) 100vw, 448px"
          style={{ width: "100%", height: "auto" }}
          className="mx-auto max-w-full rounded-2xl"
        />
      </div>
      <div className="w-20 h-20 bg-[var(--color-primary-highlight)] rounded-full flex items-center justify-center mx-auto shadow-inner border border-[var(--color-border)]">
        <CheckCircle2 className="w-10 h-10 text-[var(--color-success)]" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
          Pagamento confirmado. Agora sua jornada com a Palavra tem data de começo.
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] font-medium">
          Parabéns, <span className="text-[var(--color-text)] font-bold">{firstName}</span>. Josué 1:8 ensina a meditar na Palavra dia e noite e cuidar de praticá-la. A bênção da constância não está apenas em possuir conteúdo, mas em caminhar com ele diariamente.
        </p>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 my-8 text-left space-y-4">
        <h3 className="font-bold text-[var(--color-text-faint)] uppercase text-xs tracking-widest border-b border-[var(--color-border)] pb-3">Resumo do pedido</h3>
        
        <div className="flex justify-between items-center text-sm pt-2">
          <span className="text-[var(--color-text-muted)]">Produto</span>
          <span className="font-semibold text-[var(--color-text)] text-right">{PRODUCT.name}</span>
        </div>

        <div className="space-y-2 text-sm">
          <span className="text-[var(--color-text-muted)]">Brindes digitais</span>
          <div className="space-y-2">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
              <p className="font-semibold text-[var(--color-text)]">66 Cards Mapa da Palavra</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Acesso digital imediato após a confirmação do pagamento.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
              <p className="font-semibold text-[var(--color-text)]">Diário de Fé Mapa da Palavra</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Acesso digital imediato após a confirmação do pagamento.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
              <p className="font-semibold text-[var(--color-text)]">Guia de Estudo em 30 Dias</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Acesso digital imediato após a confirmação do pagamento.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-[var(--color-text-muted)]">Valor confirmado</span>
          <span className="font-bold text-[var(--color-success)] bg-[var(--color-primary-highlight)] px-2 py-0.5 rounded">
            <span className="mr-1 text-[var(--color-text-muted)] line-through">De {PRODUCT.originalPriceFormatted}</span>
            <span>por {PRODUCT.priceFormatted}</span>
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-[var(--color-text-muted)]">Data e hora</span>
          <span className="font-medium text-[var(--color-text)] text-right">
            {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(paidAt))}
          </span>
        </div>
      </div>

      <div className="bg-[var(--color-primary-highlight)] text-[var(--color-text)] p-5 rounded-xl text-sm leading-relaxed border border-[var(--color-border)] shadow-sm text-left">
        <strong className="block mb-1 text-base text-[var(--color-primary)]">Seu pedido do {PRODUCT.name} foi confirmado.</strong>
        <p className="mb-2">Quando ele chegar, separe um lugar, uma caneta e um horário possível. Comece simples. Um dia por vez. Uma página por vez. Uma oração por vez.</p>
        <p className="mb-2">Prazo estimado: {shippingDeadline} a partir da confirmação do pagamento.</p>
        <p className="mb-2">Os brindes digitais também fazem parte da sua jornada, com acesso liberado imediatamente após a confirmação do pagamento. Verifique o e-mail usado na compra ou acesse sua área de membros para baixar o 66 Cards Mapa da Palavra, o Diário de Fé Mapa da Palavra e o Guia de Estudo em 30 Dias.</p>
        <p className="font-semibold">Senhor, eu não quero apenas ter a Tua Palavra por perto. Eu quero caminhar com ela.</p>
      </div>
    </div>
  );
}
