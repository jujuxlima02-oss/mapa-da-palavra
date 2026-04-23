"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  validateName, 
  validateEmail, 
  validatePhone, 
  validateCPF, 
  formatCPF, 
  formatPhone,
  cleanCPF,
  cleanPhone,
  validateCEP,
  formatCEP,
  cleanCEP,
  validateCheckoutForm
} from "@/lib/validations";
import { analytics } from "@/lib/analytics";
import { PRODUCT, type ShippingMode } from "@/lib/constants";

interface CheckoutFormProps {
  offerSource: string;
  shippingMode: ShippingMode;
  onShippingModeChange: (mode: ShippingMode) => void;
}

export function CheckoutForm({ offerSource, shippingMode, onShippingModeChange }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [estadoQuery, setEstadoQuery] = useState("");
  const shippingPrice = shippingMode === "express" ? 1590 : 0;
  const estadoInputRef = useRef<HTMLInputElement | null>(null);

  const estados = [
    { uf: "AC", nome: "Acre" },
    { uf: "AL", nome: "Alagoas" },
    { uf: "AP", nome: "Amapá" },
    { uf: "AM", nome: "Amazonas" },
    { uf: "BA", nome: "Bahia" },
    { uf: "CE", nome: "Ceará" },
    { uf: "DF", nome: "Distrito Federal" },
    { uf: "ES", nome: "Espírito Santo" },
    { uf: "GO", nome: "Goiás" },
    { uf: "MA", nome: "Maranhão" },
    { uf: "MT", nome: "Mato Grosso" },
    { uf: "MS", nome: "Mato Grosso do Sul" },
    { uf: "MG", nome: "Minas Gerais" },
    { uf: "PA", nome: "Pará" },
    { uf: "PB", nome: "Paraíba" },
    { uf: "PR", nome: "Paraná" },
    { uf: "PE", nome: "Pernambuco" },
    { uf: "PI", nome: "Piauí" },
    { uf: "RJ", nome: "Rio de Janeiro" },
    { uf: "RN", nome: "Rio Grande do Norte" },
    { uf: "RS", nome: "Rio Grande do Sul" },
    { uf: "RO", nome: "Rondônia" },
    { uf: "RR", nome: "Roraima" },
    { uf: "SC", nome: "Santa Catarina" },
    { uf: "SP", nome: "São Paulo" },
    { uf: "SE", nome: "Sergipe" },
    { uf: "TO", nome: "Tocantins" },
  ];
  const estadosFiltrados = estados.filter(
    (estado) =>
      estado.uf.toLowerCase().includes(estadoQuery.toLowerCase()) ||
      estado.nome.toLowerCase().includes(estadoQuery.toLowerCase())
  );

  useEffect(() => {
    if (estadoQuery) {
      estadoInputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [estadoQuery]);

  const router = useRouter();

  useEffect(() => {
    // Dipara a intenção inicial de checkout! (Conforme regras do GA4)
    analytics.beginCheckout(offerSource, PRODUCT.priceCents);
  }, [offerSource]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const hasData = formData.name || formData.email || formData.phone || formData.cpf;
      if (hasData) {
        analytics.checkoutAbandoned(offerSource, "form_fill");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [offerSource, formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === "cpf") {
      formattedValue = formatCPF(value);
    } else if (name === "phone") {
      formattedValue = formatPhone(value);
    } else if (name === "cep") {
      formattedValue = formatCEP(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear field error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let fieldError = "";

    switch (name) {
      case "name":
        if (!validateName(value)) fieldError = "Informe seu nome completo";
        break;
      case "email":
        if (!validateEmail(value)) fieldError = "Informe um e-mail válido";
        break;
      case "phone":
        if (!validatePhone(value)) fieldError = "Informe um telefone válido com DDD";
        break;
      case "cpf":
        if (!validateCPF(value)) fieldError = "Informe um CPF válido";
        break;
      case "cep":
        if (!validateCEP(value)) fieldError = "Informe um CEP válido";
        break;
    }

    if (fieldError) {
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleCepSearch = async () => {
    if (!validateCEP(formData.cep)) {
      setErrors(prev => ({ ...prev, cep: "CEP inválido para busca" }));
      return;
    }

    setIsLoadingCep(true);
    setErrors(prev => ({ ...prev, cep: "" }));

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP(formData.cep)}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErrors(prev => ({ ...prev, cep: "CEP não encontrado" }));
      } else {
        setFormData(prev => ({
          ...prev,
          rua: data.logradouro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
        setErrors(prev => ({ ...prev, rua: "", cidade: "", estado: "" }));
      }
    } catch {
      setErrors(prev => ({ ...prev, cep: "Erro ao buscar CEP" }));
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateCheckoutForm(formData);
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: cleanPhone(formData.phone),
          cpf: cleanCPF(formData.cpf),
          cep: cleanCEP(formData.cep),
          rua: formData.rua,
          numero: formData.numero,
          complemento: formData.complemento,
          cidade: formData.cidade,
          estado: formData.estado,
          shippingMode,
          shippingPrice,
          offerSource
        }),
      });

      const data = await response.json();

      if (response.status === 201 && data.orderId) {
        // Sucesso: limpar os campos envia sinal visual sem acionar abandoned
        setFormData({ name: "", email: "", phone: "", cpf: "", cep: "", rua: "", numero: "", complemento: "", cidade: "", estado: "" });
        router.push(`/checkout/pix/${data.orderId}`);
        return; // Retornar evita o "finally" dar flicker enquanto faz a navegação Next.js
      }

      if (response.status === 400 && data.errors) {
        setErrors(data.errors);
      } else {
        setErrors({ server: data.message || "Ocorreu um erro ao processar seu pedido. Tente novamente." });
      }
    } catch (error) {
      console.error(error);
      setErrors({ server: "Sem conexão. Verifique sua internet e tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };
  const [couponCode, setCouponCode] = useState("")
  const [couponMessage, setCouponMessage] = useState("")
  const [couponValid, setCouponValid] = useState(false)

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return
    setCouponMessage("Cupom inválido ou expirado.")
    setCouponValid(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6">
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Seus dados</h2>
        
        <div>
          <Input
            label="Nome completo"
            name="name"
            placeholder="Como seu nome aparece no documento"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            disabled={isSubmitting}
          />
          
          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="Para receber a confirmação"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            disabled={isSubmitting}
          />
          
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Telefone (WhatsApp)</label>
              <div className={`flex items-center h-[48px] rounded-md border ${errors.phone ? 'border-[var(--color-error)] focus-within:shadow-[0_0_0_2px_rgba(139,42,42,0.2)]' : 'border-[var(--color-border)] focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_2px_rgba(139,94,42,0.2)]'} transition-all bg-[var(--color-surface-2)] overflow-hidden`}>
                <div className="w-20 pt-2.5 flex items-start justify-center bg-[var(--color-surface)] border-r border-[var(--color-border)] h-full text-[15px] text-[var(--color-text-muted)] select-none">
                  +55 🇧🇷
                </div>
                <input
                  name="phone"
                  type="tel"
                placeholder="Para contato sobre o pedido"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  maxLength={15}
                  className="flex-1 h-full px-3 text-[15px] bg-transparent outline-none text-[var(--color-text)]"
                />
              </div>
              {errors.phone && <span className="text-xs text-[var(--color-error)] mt-1 block font-medium">{errors.phone}</span>}
            </div>
            
            <Input
              label="CPF"
              name="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.cpf}
              disabled={isSubmitting}
              maxLength={14}
            />
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Necessário para emissão de nota fiscal</p>
          </div>
      
        <button
          type="button"
          onClick={() => setShowCoupon((value) => !value)}
          className="mt-6 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
        >
          Tenho um cupom de desconto
        </button>

        {showCoupon && (
          <div className="space-y-1 mt-4">
            <label className="text-sm font-medium text-[var(--color-text)]">
              Cupom de desconto <span className="text-[var(--color-text-faint)]">(opcional)</span>
            </label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Se tiver um cupom"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 h-12 border border-[var(--color-border)] rounded-md px-3 text-[15px] focus:border-[var(--color-primary)] focus:outline-none focus:shadow-[0_0_0_2px_rgba(139,94,42,0.2)] transition-all bg-[var(--color-surface-2)] text-[var(--color-text)]"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="h-12 px-6 bg-[var(--color-surface)] hover:bg-[var(--color-surface-offset)] border border-[var(--color-border)] rounded-md text-sm font-medium text-[var(--color-text)] transition-colors whitespace-nowrap"
                disabled={isSubmitting}
              >
                Aplicar
              </button>
            </div>
            {couponMessage && (
              <p className={`text-xs mt-1 font-medium ${couponValid ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                {couponMessage}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mb-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6">
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Endereço de entrega</h2>
        <div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="CEP"
                name="cep"
                type="text"
                placeholder="Digite seu CEP"
                value={formData.cep}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.cep}
                disabled={isSubmitting || isLoadingCep}
                maxLength={9}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCepSearch}
              disabled={isSubmitting || isLoadingCep}
              className="h-[48px] px-6 text-sm font-semibold mb-4"
            >
              {isLoadingCep ? "Buscando..." : "Buscar"}
            </Button>
          </div>

              <Input
                label="Rua / Avenida"
                name="rua"
                placeholder="Preenchido automaticamente se possível"
            value={formData.rua}
            onChange={handleChange}
            error={errors.rua}
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-2 gap-4">
              <Input
                label="Número"
                name="numero"
                placeholder="123"
              value={formData.numero}
              onChange={handleChange}
              error={errors.numero}
              disabled={isSubmitting}
            />
              <Input
                label="Complemento (opcional)"
                name="complemento"
                placeholder="Apto 42"
              value={formData.complemento}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Cidade"
                name="cidade"
                placeholder="Sua cidade"
              value={formData.cidade}
              onChange={handleChange}
              error={errors.cidade}
              disabled={isSubmitting}
            />
            
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="block text-sm font-medium text-[var(--color-text)]">Estado</label>
              <div
                role="combobox"
                aria-controls="estado-options"
                aria-expanded={estadoQuery.length > 0}
                aria-autocomplete="list"
                aria-haspopup="listbox"
                className={`
                  relative w-full rounded-md border bg-[var(--color-surface-2)] text-[15px] transition-all
                  ${errors.estado ? "border-[var(--color-error)] focus-within:shadow-[0_0_0_2px_rgba(139,42,42,0.2)]" : "border-[var(--color-border)]"}
                `}
              >
                <input
                  ref={estadoInputRef}
                  type="text"
                  value={estadoQuery || formData.estado}
                  onChange={(e) => setEstadoQuery(e.target.value)}
                  placeholder="Selecione..."
                  inputMode="text"
                  autoComplete="off"
                  className="w-full px-3 h-[48px] rounded-md bg-transparent text-[var(--color-text)] outline-none focus:ring-0"
                  disabled={isSubmitting}
                />
                {estadoQuery && (
                  <div
                    id="estado-options"
                    role="listbox"
                    className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] shadow-lg"
                  >
                    {estadosFiltrados.length > 0 ? (
                      estadosFiltrados.map((estado) => (
                        <button
                          key={estado.uf}
                          type="button"
                          role="option"
                          aria-selected={formData.estado === estado.uf}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, estado: estado.uf }));
                            setEstadoQuery(estado.nome);
                            if (errors.estado) {
                              setErrors((prev) => ({ ...prev, estado: "" }));
                            }
                          }}
                          className="flex w-full min-h-11 items-center justify-between px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-primary-highlight)]"
                        >
                          <span>{estado.nome}</span>
                          <span className="text-[var(--color-text-faint)]">{estado.uf}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-[var(--color-text-muted)]">Nenhum estado encontrado</div>
                    )}
                  </div>
                )}
              </div>
              {errors.estado && <span className="text-xs text-[var(--color-error)] mt-0.5">{errors.estado}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[var(--color-text-muted)]" aria-hidden="true">🚚</span>
          <p className="text-sm font-semibold text-[var(--color-text)]">Opções de frete</p>
        </div>

        <div className="space-y-3 w-full px-0">
          <button
            type="button"
            onClick={() => onShippingModeChange("free")}
            className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left transition-all ${
              shippingMode === "free"
                ? "border-[var(--color-primary)] bg-[var(--color-primary-highlight)] shadow-sm"
                : "border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-highlight)]"
            }`}
          >
            <span className="flex min-w-0 flex-1 items-center gap-3">
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                  shippingMode === "free" ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"
                }`}
                aria-hidden="true"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    shippingMode === "free" ? "bg-[var(--color-primary)]" : "bg-transparent"
                  }`}
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="block text-sm font-semibold text-[var(--color-text)]">Correios</span>
                <span className="block text-sm text-[var(--color-text-muted)]">6 a 12 dias úteis</span>
              </span>
            </span>
            <span className="flex flex-shrink-0 items-center gap-2 text-right text-sm font-semibold text-[var(--color-success)]">
              <span aria-hidden="true">$</span>
              R$ 0,00
            </span>
          </button>

          <button
            type="button"
            onClick={() => onShippingModeChange("express")}
            className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left transition-all ${
              shippingMode === "express"
                ? "border-[var(--color-primary)] bg-[var(--color-primary-highlight)] shadow-sm"
                : "border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-highlight)]"
            }`}
          >
            <span className="flex min-w-0 flex-1 items-center gap-3">
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                  shippingMode === "express" ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"
                }`}
                aria-hidden="true"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    shippingMode === "express" ? "bg-[var(--color-primary)]" : "bg-transparent"
                  }`}
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="block text-sm font-semibold text-[var(--color-text)]">Expresso</span>
                <span className="block text-sm text-[var(--color-text-muted)]">3 a 6 dias úteis</span>
              </span>
            </span>
            <span className="flex flex-shrink-0 items-center gap-2 text-right text-sm font-semibold text-[var(--color-text)]">
              <span aria-hidden="true">🕒</span>
              R$ 15,90
            </span>
          </button>
        </div>

        <p className="mt-3 text-xs text-[var(--color-text-muted)]">
          A modalidade escolhida atualiza o resumo do pedido automaticamente.
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full mt-6 bg-[#16a34a] hover:bg-green-700 text-white font-bold text-[16px] uppercase tracking-[0.5px] h-[52px] rounded-md transition-all shadow-none"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Processando...
          </span>
        ) : (
          "Pagar agora"
        )}
      </Button>

      {errors.server && (
        <div className="text-sm font-medium text-center mt-3 bg-[var(--color-primary-highlight)] py-2 px-3 rounded border border-[var(--color-border)] text-[var(--color-error)]">
          {errors.server}
        </div>
      )}
      
      <p className="text-[11px] text-[var(--color-text-muted)] text-center mt-4 leading-relaxed px-4">
        Ao clicar em &apos;Pagar agora&apos;, confirmo que li e concordo com os
        <a href="/termos-de-uso" className="underline ml-1">Termos de Uso</a> e
        <a href="/politica-de-privacidade" className="underline ml-1">Política de Privacidade</a>.
      </p>

      <div className="flex justify-center items-center gap-4 mt-6 text-[11px] text-[var(--color-text-faint)] font-medium">
         <span>🔒 Compra segura</span>
         <span>✅ Garantia 30 dias</span>
         <span>📦 Entrega garantida</span>
      </div>
    </form>
  );
}
