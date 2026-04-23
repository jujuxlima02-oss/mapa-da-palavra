"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { SHIPPING, formatCentsToBRL, type ShippingMode } from "@/lib/constants";
import { X } from "lucide-react";

interface ShippingModalProps {
  open: boolean;
  selectedMode: ShippingMode;
  onSelect: (mode: ShippingMode) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function ShippingModal({ open, selectedMode, onSelect, onConfirm, onClose }: ShippingModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const focusables = Array.from(focusable).filter((el) => !el.hasAttribute("disabled"));

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const options = [
    SHIPPING.free,
    SHIPPING.express,
  ].map((shipping, index) => {
    const mode = index === 0 ? "free" : "express";
    return {
      mode,
      shipping,
    } as const;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-[var(--color-dark-section)]/60"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shipping-modal-title"
        className="relative z-10 w-full max-w-lg rounded-2xl bg-[var(--color-surface-2)] p-6 shadow-2xl ring-1 ring-[var(--color-border)]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Fechar modal"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-10">
          <h2 id="shipping-modal-title" className="text-xl font-bold text-[var(--color-text)]">
            Escolha a modalidade de entrega
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Selecione a opção que faz mais sentido para sua compra.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {options.map(({ mode, shipping }) => (
            <button
              key={mode}
              type="button"
              onClick={() => onSelect(mode)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                selectedMode === mode
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-highlight)] shadow-sm"
                  : "border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-highlight)]"
              }`}
            >
              <span
                className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border ${
                  selectedMode === mode ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"
                }`}
                aria-hidden="true"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    selectedMode === mode ? "bg-[var(--color-primary)]" : "bg-transparent"
                  }`}
                />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-[var(--color-text)]">{shipping.label}</span>
                <span className="block text-sm text-[var(--color-text-muted)]">{shipping.days}</span>
              </span>
              <span
                className={`text-sm font-semibold ${
                  shipping.price === 0 ? "text-[var(--color-success)]" : "text-[var(--color-text)]"
                }`}
              >
                {shipping.price === 0 ? "Grátis" : formatCentsToBRL(shipping.price)}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            onClick={onConfirm}
            className="h-12 px-6"
          >
            Confirmar entrega →
          </Button>
        </div>
      </div>
    </div>
  );
}
