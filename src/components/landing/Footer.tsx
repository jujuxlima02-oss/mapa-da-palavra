import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[var(--color-dark-section)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <Image
          src="/assets/logo-mapa-da-palavra-atualizada.webp"
          alt="Logo Mapa da Palavra"
          width={240}
          height={120}
          sizes="240px"
          className="mb-6 max-h-[72px] w-auto bg-[var(--color-dark-section)] sm:max-h-[100px]"
        />
        <p className="text-[var(--color-dark-text)]/70 text-sm text-center max-w-md mb-6">
          {PRODUCT.name} — Uma marca registrada. Todos os direitos reservados {new Date().getFullYear()}.
        </p>
        <p className="mb-6 max-w-md text-center text-xs leading-5 text-[var(--color-dark-text)]/55">
          Mapa da Palavra • CNPJ 59.395.406/0001-63 • Rio de Janeiro - RJ
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-[var(--color-dark-text)]/55">
           <Link href="/termos-de-uso" className="inline-flex min-h-11 items-center px-2 hover:text-[var(--color-dark-text)]">Termos de Uso</Link>
           <Link href="/politica-de-privacidade" className="inline-flex min-h-11 items-center px-2 hover:text-[var(--color-dark-text)]">Privacidade</Link>
           <Link href="/politica-de-garantia" className="inline-flex min-h-11 items-center px-2 hover:text-[var(--color-dark-text)]">Política de Garantia</Link>
      </div>
      </div>
    </footer>
  );
}
