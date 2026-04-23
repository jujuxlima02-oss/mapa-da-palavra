import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { PRODUCT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[var(--color-dark-section)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <BookOpen className="h-10 w-10 text-[var(--color-accent)] mb-6" />
        <p className="text-[var(--color-dark-text)]/70 text-sm text-center max-w-md mb-6">
          {PRODUCT.name} — Uma marca registrada. Todos os direitos reservados {new Date().getFullYear()}.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--color-dark-text)]/55">
           <Link href="/termos-de-uso" className="hover:text-[var(--color-dark-text)]">Termos de Uso</Link>
           <Link href="/politica-de-privacidade" className="hover:text-[var(--color-dark-text)]">Privacidade</Link>
           <Link href="/politica-de-garantia" className="hover:text-[var(--color-dark-text)]">Política de Garantia</Link>
      </div>
      </div>
    </footer>
  );
}
