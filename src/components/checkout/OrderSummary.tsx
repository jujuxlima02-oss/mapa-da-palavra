import Image from "next/image";
import { DIGITAL_GIFTS, PRODUCT, SHIPPING, formatCentsToBRL, type ShippingMode } from "@/lib/constants";

interface OrderSummaryProps {
  shippingMode: ShippingMode;
}

export function OrderSummary({ shippingMode }: OrderSummaryProps) {
  const shipping = SHIPPING[shippingMode];
  const shippingTotal = shipping.price > 0 ? shipping.price : 0;
  const shippingDeadline =
    shippingMode === "express" ? SHIPPING.express.days : SHIPPING.free.days;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between border-b border-[var(--color-divider)] pb-3">
        <div>
          <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-lg bg-[var(--color-surface-2)] ring-1 ring-[var(--color-border)]">
            {/* TODO: substituir por asset final do Nanobanana — Briefing 10: Miniatura checkout // PLACEHOLDER */}
            <Image
              src="/assets/imagem-produto.webp"
              alt={`Miniatura limpa do ${PRODUCT.name}`}
              width={64}
              height={64}
              sizes="64px"
              style={{ aspectRatio: "1 / 1" }}
              className="object-cover"
            />
          </div>
          <h3 className="font-semibold text-[var(--color-text)] leading-tight">{PRODUCT.name}</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Seu pedido confirma uma decisão espiritual com clareza, segurança e direção.
          </p>
        </div>
        <div className="text-right pl-4">
          <p className="text-xs text-[var(--color-text-muted)] line-through">De {PRODUCT.originalPriceFormatted}</p>
          <p className="font-bold text-[var(--color-text)]">por {PRODUCT.priceFormatted}</p>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span className="inline-flex rounded bg-[var(--color-primary-highlight)] px-2 py-0.5 text-xs font-semibold text-[var(--color-success)]">
            🎁 BRINDES DIGITAIS
          </span>
          <div className="space-y-1 text-sm text-[var(--color-text)]">
            {DIGITAL_GIFTS.map((gift) => (
              <div key={gift.name}>
                <p className="font-medium">{gift.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Digital • Acesso imediato após a confirmação do pagamento
                </p>
              </div>
            ))}
          </div>
        </div>
        <span className="pt-0.5 font-semibold text-[var(--color-success)]">Grátis</span>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--color-divider)] pt-3">
        <span className="text-sm font-medium text-[var(--color-text)]">Frete</span>
        <span className={`text-sm font-semibold ${shipping.price === 0 ? "text-[var(--color-success)]" : "text-[var(--color-text)]"}`}>
          {formatCentsToBRL(shipping.price)}
        </span>
      </div>
      <p className="text-xs text-[var(--color-text-muted)] -mt-1">
        Previsão de entrega: {shippingDeadline} após confirmação do pagamento
      </p>
      <p className="text-xs text-[var(--color-text-muted)]">
        Você está a um passo de começar sua jornada com a Palavra.
      </p>

      <div className="border-t border-[var(--color-divider)] pt-3">
        <div className="flex justify-between items-center">
        <span className="font-medium text-[var(--color-text)] text-lg">Total</span>
        <span className="text-xl font-bold text-[var(--color-success)]">
          {formatCentsToBRL(PRODUCT.priceCents + shippingTotal)}
        </span>
        </div>
      </div>
    </div>
  );
}
