"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { featureFlags, type LandingPageKey } from "@/lib/featureFlags";

type Buyer = {
  name: string;
  state: string;
  time: string;
};

const buyers: Buyer[] = [
  { name: "Maria Eduarda", state: "RJ", time: "Há 2 minutos" },
  { name: "João Pedro", state: "MG", time: "Há 5 minutos" },
  { name: "Ana Cláudia", state: "SP", time: "Há 7 minutos" },
  { name: "Fernanda", state: "BA", time: "Há 3 minutos" },
  { name: "Carlos Eduardo", state: "PR", time: "Há 9 minutos" },
  { name: "Patrícia", state: "GO", time: "Há 12 minutos" },
  { name: "Marcos", state: "CE", time: "Há 4 minutos" },
  { name: "Luciana", state: "RS", time: "Há 6 minutos" },
  { name: "Rafael", state: "PE", time: "Há 11 minutos" },
  { name: "Simone", state: "SC", time: "Há 8 minutos" },
  { name: "Débora", state: "ES", time: "Há 14 minutos" },
  { name: "Thiago", state: "AM", time: "Há 3 minutos" },
  { name: "Rosângela", state: "PB", time: "Há 10 minutos" },
  { name: "Vinícius", state: "MT", time: "Há 16 minutos" },
  { name: "Cristiane", state: "DF", time: "Há 1 minuto" },
  { name: "Aline", state: "RN", time: "Há 13 minutos" },
  { name: "Bruno", state: "SP", time: "Há 5 minutos" },
  { name: "Camila", state: "AL", time: "Há 9 minutos" },
  { name: "Daniel", state: "PA", time: "Há 7 minutos" },
  { name: "Eliane", state: "MS", time: "Há 4 minutos" },
  { name: "Fábio", state: "TO", time: "Há 15 minutos" },
  { name: "Gabriela", state: "AP", time: "Há 2 minutos" },
  { name: "Henrique", state: "RR", time: "Há 18 minutos" },
  { name: "Isabela", state: "SE", time: "Há 6 minutos" },
  { name: "Juliana", state: "MA", time: "Há 8 minutos" },
  { name: "Kleber", state: "CE", time: "Há 11 minutos" },
  { name: "Larissa", state: "SC", time: "Há 3 minutos" },
  { name: "Mateus", state: "PR", time: "Há 10 minutos" },
  { name: "Nathalia", state: "RJ", time: "Há 1 minuto" },
  { name: "Otávio", state: "SP", time: "Há 14 minutos" },
  { name: "Paula", state: "MG", time: "Há 6 minutos" },
  { name: "Rita", state: "BA", time: "Há 12 minutos" },
  { name: "Samuel", state: "GO", time: "Há 4 minutos" },
  { name: "Tatiane", state: "PE", time: "Há 9 minutos" },
  { name: "Ulisses", state: "DF", time: "Há 16 minutos" },
  { name: "Viviane", state: "RS", time: "Há 5 minutos" },
  { name: "William", state: "CE", time: "Há 7 minutos" },
  { name: "Yasmin", state: "AM", time: "Há 2 minutos" },
  { name: "Zuleica", state: "PB", time: "Há 13 minutos" },
];

const messages = [
  "Entrou hoje na caminhada com a Palavra.",
  "Separou tempo diário para Deus.",
  "Decidiu recomeçar com clareza espiritual.",
  "Firmou um novo pacto com a rotina devocional.",
  "Escolheu voltar para a Palavra com constância.",
  "Começou um novo hábito de leitura com propósito.",
  "Assumiu um compromisso real com seu devocional.",
  "Separou o melhor horário do dia para Deus.",
  "Quis enxergar a Bíblia com mais direção.",
  "Transformou intenção em rotina espiritual.",
  "Decidiu cultivar mais intimidade com Deus.",
  "Voltou a priorizar a Palavra na agenda.",
];

interface BuyNotificationProps {
  page: LandingPageKey;
}

export function BuyNotification({ page }: BuyNotificationProps) {
  const config = featureFlags.landingExperiments.buyNotificationTest;
  const enabledForPage =
    config.enabled &&
    ((page === "evergreen" && config.pages.evergreen) ||
      (page === "diaDasMaes" && config.pages.diaDasMaes));

  const [visible, setVisible] = useState(false);
  const [entry, setEntry] = useState<{ buyer: Buyer; message: string } | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const hideRef = useRef<number | null>(null);
  const cycleRef = useRef(0);
  const orderRef = useRef<Buyer[]>([]);

  useEffect(() => {
    if (!enabledForPage) {
      return;
    }

    const showNext = () => {
      if (!orderRef.current.length) {
        orderRef.current = [...buyers].sort(() => Math.random() - 0.5);
      }

      const currentIndex = cycleRef.current % orderRef.current.length;
      const buyer = orderRef.current[currentIndex];
      const message = messages[currentIndex % messages.length];

      setEntry({ buyer, message });
      setVisible(true);
      cycleRef.current += 1;

      hideRef.current = window.setTimeout(() => {
        setVisible(false);
      }, 6000);

      timeoutRef.current = window.setTimeout(showNext, 7000 + Math.floor(Math.random() * 1001));
    };

    timeoutRef.current = window.setTimeout(showNext, 7000 + Math.floor(Math.random() * 1001));

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (hideRef.current) {
        window.clearTimeout(hideRef.current);
      }
    };
  }, [enabledForPage]);

  if (!enabledForPage || !entry) return null;

  return (
    <div
      className={`pointer-events-none fixed bottom-4 left-4 z-50 w-[min(86vw,280px)] transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      aria-hidden="true"
    >
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-3 py-2.5 text-[var(--color-text)] shadow-md shadow-black/10 backdrop-blur-sm">
        <div className="flex items-start gap-2.5">
          <div className="relative mt-0.5 h-9 w-9 flex-none overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
            {/* TODO: substituir por asset final do Nanobanana — Briefing 4: Social proof evergreen // PLACEHOLDER */}
            <Image
              src="/assets/imagem-produto.webp"
              alt="Miniatura do guia Mapa da Palavra"
              width={36}
              height={36}
              sizes="36px"
              style={{ aspectRatio: "1 / 1" }}
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-tight">
              {entry.buyer.name} - {entry.buyer.state}
            </p>
            <p className="mt-1 text-xs leading-snug text-[var(--color-text-muted)] line-clamp-2">
              {entry.message}
            </p>
            <p className="mt-1.5 text-[10px] text-[var(--color-text-faint)]">{entry.buyer.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
