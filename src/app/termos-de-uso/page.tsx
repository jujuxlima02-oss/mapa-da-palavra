import type { Metadata } from "next";
import Link from "next/link";
import { SHIPPING } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Termos de Uso | Mapa da Palavra",
  description: "Termos de uso do Mapa da Palavra.",
};

export default function TermosDeUsoPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-[640px] px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Link href="/" className="inline-flex min-h-11 items-center py-2 hover:text-[var(--color-text)]">Início</Link>
          <span className="mx-2">/</span>
          <span>Termos de Uso</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">Termos de Uso</h1>
          <p className="mt-3 text-base leading-7 text-[var(--color-text-muted)]">
            Estes termos explicam as condições de compra e uso do site e da oferta do Mapa da Palavra.
          </p>
        </header>

        <section className="space-y-6 text-base leading-7 text-[var(--color-text)]">
          <p>
            Este site é operado por <strong>Mapa da Palavra</strong>, inscrita no CNPJ sob o nº <strong>59.395.406/0001-63</strong>, com sede em <strong>Rio de Janeiro - RJ</strong>.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">1. Objeto</h2>
          <p>
            O Mapa da Palavra é a venda de um produto físico: um guia visual dos 66 livros da Bíblia, enviado ao endereço informado pelo cliente.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">2. Compra e confirmação</h2>
          <p>
            A compra é concluída após o preenchimento dos dados, revisão do pedido e confirmação do pagamento pela processadora escolhida.
          </p>
          <p>
            Após a confirmação, o cliente recebe a confirmação do pedido por e-mail e as próximas orientações de acompanhamento.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">3. Entrega</h2>
          <p>
            Trabalhamos com as seguintes modalidades de frete, conforme a oferta exibida no checkout:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong>{SHIPPING.free.label}</strong>: {SHIPPING.free.days}.</li>
            <li><strong>{SHIPPING.express.label}</strong>: {SHIPPING.express.days}.</li>
          </ul>
          <p>
            Os prazos são estimativas e passam a contar após a confirmação do pagamento.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">4. Cancelamento</h2>
          <p>
            Antes do envio, o pedido pode ser cancelado mediante solicitação ao contato oficial. Após o envio, aplicam-se as regras da política de garantia e do CDC, quando cabíveis.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">5. Limitação de responsabilidade</h2>
          <p>
            Não nos responsabilizamos por atrasos decorrentes de informações incorretas fornecidas pelo cliente, ausência no endereço de entrega, restrições logísticas da transportadora ou eventos fora do nosso controle.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">6. Foro</h2>
          <p>
            Fica eleito o foro da comarca de <strong>Rio de Janeiro - RJ</strong> para dirimir eventuais controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">7. Contato</h2>
          <p>
            Para dúvidas sobre estes termos, escreva para <a className="text-[var(--color-primary)] underline" href="mailto:contato@mapadapalavra.com.br">contato@mapadapalavra.com.br</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
