import Image from "next/image";
import { BUNDLE_ITEM, PRODUCT, SHIPPING, formatCentsToBRL, type ShippingMode } from "@/lib/constants";
import productThumb from "../../../imagens_produto/6-1.png";
import bundleThumb from "../../../imagens_produto/Untitled_design_2_700x.png";

interface OrderSummaryProps {
  offerSource: string;
  shippingMode: ShippingMode;
}

export function OrderSummary({ offerSource, shippingMode }: OrderSummaryProps) {
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
              src={productThumb}
              alt="Miniatura limpa do guia Mapa da Palavra"
              width={64}
              height={64}
              sizes="64px"
              style={{ aspectRatio: "1 / 1" }}
              className="object-cover"
            />
          </div>
          <h3 className="font-semibold text-[var(--color-text)] leading-tight">{PRODUCT.name}</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Seu Diário para separar tempo com Deus.</p>
        </div>
        <div className="text-right pl-4">
          <p className="font-bold text-[var(--color-text)]">{PRODUCT.priceFormatted}</p>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-[var(--color-surface-2)] ring-1 ring-[var(--color-border)]">
              {/* TODO: substituir por asset final do Nanobanana — Briefing 9: Brinde Colar Coração de Jesus // PLACEHOLDER */}
              <Image
                src={bundleThumb}
                alt="Thumbnail do colar Coração de Jesus"
                width={48}
                height={48}
                sizes="48px"
                style={{ aspectRatio: "1 / 1" }}
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
                <span className="inline-flex rounded bg-[var(--color-primary-highlight)] px-2 py-0.5 text-xs font-semibold text-[var(--color-success)]">
                🎁 BRINDE
              </span>
              <p className="text-sm text-[var(--color-text)]">{BUNDLE_ITEM.name}</p>
            </div>
          </div>
        </div>
        <span className="pt-0.5 font-semibold text-[var(--color-success)]">Grátis</span>
      </div>
      
      {offerSource === "dia-das-maes" && (
        <div className="flex justify-between items-center text-[var(--color-primary)] font-bold text-xs bg-[var(--color-primary-highlight)] px-3 py-2 rounded border border-[var(--color-border)]">
          <span className="flex items-center gap-1.5">🎁 Oferta especial (Mães)</span>
          <span>BÔNUS INCLUSO</span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-[var(--color-divider)] pt-3">
        <span className="text-sm font-medium text-[var(--color-text)]">Frete</span>
        <span className={`text-sm font-semibold ${shipping.price === 0 ? "text-[var(--color-success)]" : "text-[var(--color-text)]"}`}>
          {formatCentsToBRL(shipping.price)}
        </span>
      </div>
      <p className="text-xs text-[var(--color-text-muted)] -mt-1">
        Previsão de entrega: {shippingDeadline} após confirmação do pagamento
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
