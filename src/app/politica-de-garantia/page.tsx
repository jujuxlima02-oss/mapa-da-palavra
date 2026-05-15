import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Garantia | Mapa da Palavra",
  description: "Política de garantia e devolução do Mapa da Palavra.",
};

export default function PoliticaDeGarantiaPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-[640px] px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Link href="/" className="inline-flex min-h-11 items-center py-2 hover:text-[var(--color-text)]">Início</Link>
          <span className="mx-2">/</span>
          <span>Política de Garantia</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">Política de Garantia</h1>
          <p className="mt-3 text-base leading-7 text-[var(--color-text-muted)]">
            Aqui você encontra como funciona a garantia de 30 dias do Mapa da Palavra.
          </p>
        </header>

        <section className="space-y-6 text-base leading-7 text-[var(--color-text)]">
          <p>
            Esta política é operada por <strong>Mapa da Palavra</strong>, CNPJ <strong>59.395.406/0001-63</strong>, com sede em <strong>Rio de Janeiro - RJ</strong>.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">1. Garantia legal de arrependimento</h2>
          <p>
            Você pode exercer o direito de arrependimento em até 30 dias, conforme o CDC, desde que o produto esteja intacto, sem sinais de uso e com seus itens originais.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">2. Garantia por defeito de fabricação</h2>
          <p>
            Se o produto físico apresentar defeito de fabricação, você deve nos avisar em até 30 dias após o recebimento para avaliarmos a melhor solução.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">3. Como acionar</h2>
          <p>
            Envie um e-mail para <a className="text-[var(--color-primary)] underline" href="mailto:contato@mapadapalavra.com.br">contato@mapadapalavra.com.br</a> com:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>número do pedido;</li>
            <li>descrição do problema;</li>
            <li>foto ou vídeo do item, quando aplicável.</li>
          </ul>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">4. Devolução e reembolso</h2>
          <p>
            Quando aplicável, orientaremos a devolução do produto. O reembolso será feito via PIX para a conta informada pelo cliente após a análise e confirmação da solicitação.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">5. O que não cobre</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>uso indevido do produto;</li>
            <li>danos causados por mau uso;</li>
            <li>avarias provocadas após o recebimento;</li>
            <li>situações que não sejam defeito de fabricação ou hipóteses legais de arrependimento.</li>
          </ul>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">6. Prazo de resposta</h2>
          <p className="break-words">
            Respondemos às solicitações em até 5 dias úteis.
          </p>
        </section>
      </div>
    </main>
  );
}
