import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[var(--color-dark-section)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <Image
          src="/assets/logo-mapa-da-palavra-atualizada.jpg"
          alt="Logo Mapa da Palavra"
          width={240}
          height={120}
          sizes="240px"
          className="mb-6 max-h-[72px] w-auto bg-[var(--color-dark-section)] sm:max-h-[100px]"
        />
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
