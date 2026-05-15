import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade | Mapa da Palavra",
  description: "Política de privacidade e tratamento de dados do Mapa da Palavra.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-[640px] px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <Link href="/" className="inline-flex min-h-11 items-center py-2 hover:text-[var(--color-text)]">Início</Link>
          <span className="mx-2">/</span>
          <span>Política de Privacidade</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">Política de Privacidade</h1>
          <p className="mt-3 text-base leading-7 text-[var(--color-text-muted)]">
            Explicamos de forma simples como tratamos seus dados pessoais, em conformidade com a LGPD.
          </p>
        </header>

        <section className="space-y-6 text-base leading-7 text-[var(--color-text)]">
          <p>
            Este site é operado por <strong>Mapa da Palavra</strong>, CNPJ <strong>59.395.406/0001-63</strong>, com sede em <strong>Rio de Janeiro - RJ</strong>.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">1. Dados coletados</h2>
          <p>Podemos coletar nome, e-mail, telefone, CPF e endereço de entrega quando você realiza uma compra ou entra em contato conosco.</p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">2. Finalidade do uso</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Processar o pedido.</li>
            <li>Emitir nota fiscal quando necessário.</li>
            <li>Realizar a entrega do produto físico.</li>
            <li>Prestar suporte ao cliente.</li>
          </ul>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">3. Base legal</h2>
          <p>
            O tratamento dos dados se baseia na execução de contrato e no cumprimento de obrigação legal, como emissão fiscal e obrigações correlatas.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">4. Compartilhamento</h2>
          <p>
            Seus dados podem ser compartilhados com a processadora de pagamento GestãoPay e com a transportadora responsável pela entrega, apenas na medida necessária para a operação do pedido.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">5. Direitos do titular</h2>
          <p>
            Você pode solicitar acesso, correção, exclusão e portabilidade dos seus dados, além de obter informações sobre o tratamento realizado.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">6. Retenção de dados</h2>
          <p>
            Mantemos os dados pelo tempo necessário para cumprir as finalidades acima, obrigações legais, regulatórias e de segurança.
          </p>

          <h2 className="text-xl font-semibold text-[var(--color-text)]">7. Contato do encarregado</h2>
          <p>
            Para dúvidas ou solicitações relacionadas à privacidade, entre em contato com <a className="break-all text-[var(--color-primary)] underline" href="mailto:contato@mapadapalavra.com.br">contato@mapadapalavra.com.br</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
